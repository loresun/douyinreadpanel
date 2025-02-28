document.addEventListener('DOMContentLoaded', function() {
  // 初始化标签页切换
  initTabs();
  // 获取当前标签页信息
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    // 检查是否在抖音网站
    if (currentTab.url.includes('douyin.com')) {
      // 向内容脚本发送消息获取视频信息
      chrome.tabs.sendMessage(currentTab.id, {action: "getVideoInfo"}, function(response) {
        if (response && response.title) {
          document.getElementById('video-title').textContent = response.title;
          document.getElementById('video-link').textContent = response.url;
          
          // 尝试从历史记录中加载最新的文案
          loadLatestContentFromHistory(response.url);
        }
      });
    } else {
      document.getElementById('video-title').textContent = "请在抖音网站使用此插件";
      document.getElementById('get-content').disabled = true;
    }
  });
  
  // 加载最新的历史记录文案的函数
  function loadLatestContentFromHistory(currentUrl) {
    chrome.storage.local.get('history', function(data) {
      if (data.history && data.history.length > 0) {
        // 查找匹配当前URL的最新记录
        const matchingRecord = data.history.find(record => record.link === currentUrl);
        if (matchingRecord) {
          // 填充文案内容
          document.getElementById('video-content').textContent = matchingRecord.content;
          
          // 如果有分析结果，也填充分析结果
          if (matchingRecord.analysis && matchingRecord.analysis !== '选择分析类型并点击"分析"按钮') {
            document.getElementById('analysis-result').textContent = matchingRecord.analysis;
            // 设置分析类型
            document.getElementById('analysis-type').value = matchingRecord.analysisType || 'summary';
          }
        }
      }
    });
  }
  
  // 复制链接按钮
  document.getElementById('copy-link').addEventListener('click', function() {
    const link = document.getElementById('video-link').textContent;
    if (link !== '未获取') {
      navigator.clipboard.writeText(link).then(() => {
        alert('链接已复制到剪贴板');
      });
    }
  });
  
  // 获取文案按钮
  document.getElementById('get-content').addEventListener('click', function() {
    console.log('获取文案按钮被点击');
    const videoLink = document.getElementById('video-link').textContent;
    if (videoLink === '未获取') {
      console.log('视频链接未获取，终止操作');
      alert('请先获取视频链接');
      return;
    }
    
    console.log('开始获取文案，视频链接:', videoLink);
    document.getElementById('loading-content').classList.remove('hidden');
    document.getElementById('content-error').classList.add('hidden');
    document.getElementById('video-content').textContent = '正在获取文案...';
    
    // 从存储中获取API设置
    chrome.storage.sync.get(['douyinApiKey', 'douyinBotId'], function(data) {
      console.log('获取到API设置:', { apiKey: data.douyinApiKey ? '已设置' : '使用默认值', botId: data.douyinBotId ? '已设置' : '使用默认值' });
      const apiKey = data.douyinApiKey || 'pat_83B92PL17jNaa60C1GuleCCcWrP0FzdYHgjS2wHCF2edVQN8zKt4fp0ic4XCcCCA';
      const botId = data.douyinBotId || '7476121456825663538';
      
      console.log('准备发送消息到background script');
      // 通过后台脚本调用API获取文案，避免CORS问题
      chrome.runtime.sendMessage({
        action: "fetchDouyinContent",
        videoUrl: videoLink,
        apiKey: apiKey,
        botId: botId
      }, function(response) {
        console.log('收到background script响应:', response);
        if (response && response.success && response.content) {
          console.log('成功获取文案:', response.content);
          document.getElementById('video-content').textContent = response.content;
          document.getElementById('loading-content').classList.add('hidden');
          document.getElementById('content-error').classList.add('hidden');
          
          // 自动保存到历史记录
          saveToHistory();
        } else {
          console.log('获取文案失败:', response?.error || '未知错误');
          document.getElementById('loading-content').classList.add('hidden');
          document.getElementById('content-error').classList.remove('hidden');
          document.getElementById('content-error').textContent = `获取文案失败: ${response?.error || '无法获取视频文案，请稍后重试'}`;
          document.getElementById('video-content').textContent = '点击"获取文案"按钮获取视频文案';
        }
      });
    });
  });
  
  // 复制文案按钮
  document.getElementById('copy-content').addEventListener('click', function() {
    const content = document.getElementById('video-content').textContent;
    if (content !== '点击"获取文案"按钮获取视频文案') {
      navigator.clipboard.writeText(content).then(() => {
        alert('文案已复制到剪贴板');
      });
    }
  });
  
  // 分析按钮
  document.getElementById('analyze-btn').addEventListener('click', function() {
    const content = document.getElementById('video-content').textContent;
    if (content === '点击"获取文案"按钮获取视频文案') {
      alert('请先获取视频文案');
      return;
    }
    
    const analysisType = document.getElementById('analysis-type').value;
    
    document.getElementById('loading-analysis').classList.remove('hidden');
    document.getElementById('analysis-error').classList.add('hidden');
    
    // 从存储中获取API设置
    chrome.storage.sync.get(['aiModelApiKey', 'promptTemplates'], function(data) {
      const apiKey = data.aiModelApiKey || '';
      const templates = data.promptTemplates || {
        summary: "请对以下内容进行摘要：",
        keywords: "请从以下内容中提取关键词：",
        rewrite: "请改写以下文案，使其更吸引人：",
        custom: "请分析以下内容："
      };
      
      // 获取对应的提示词
      let prompt = templates[analysisType] + "\n\n" + content;
      
      // 通过后台脚本调用大模型API进行分析，避免CORS问题
      chrome.runtime.sendMessage({
        action: "analyzeWithAI",
        prompt: prompt,
        apiKey: apiKey
      }, function(response) {
        if (response && response.success) {
          document.getElementById('analysis-result').textContent = response.result;
          document.getElementById('loading-analysis').classList.add('hidden');
          
          // 自动保存到历史记录
          saveToHistory();
        } else {
          document.getElementById('loading-analysis').classList.add('hidden');
          document.getElementById('analysis-error').classList.remove('hidden');
          document.getElementById('analysis-error').textContent = `分析失败: ${response?.error || '未知错误'}`;
        }
      });
    });
  });
  
  // 自动保存到历史记录的函数
  function saveToHistory() {
    const title = document.getElementById('video-title').textContent;
    const link = document.getElementById('video-link').textContent;
    const content = document.getElementById('video-content').textContent;
    const analysis = document.getElementById('analysis-result').textContent;
    const analysisType = document.getElementById('analysis-type').value;
    
    if (title === '未获取' || content === '点击"获取文案"按钮获取视频文案') {
      return; // 没有有效内容，不保存
    }
    
    const record = {
      title,
      link,
      content,
      analysis,
      analysisType,
      timestamp: new Date().toISOString()
    };
    
    // 保存到本地存储
    chrome.storage.local.get('history', function(data) {
      const history = data.history || [];
      
      // 检查是否已有相同链接的记录，如果有则更新
      const existingIndex = history.findIndex(item => item.link === link);
      if (existingIndex !== -1) {
        // 如果已有记录，检查是否有不同的分析类型
        const existingRecord = history[existingIndex];
        // 如果分析类型不同，则创建新记录而不是覆盖
        if (existingRecord.analysisType !== analysisType) {
          history.unshift(record); // 添加新记录到开头
        } else {
          history.splice(existingIndex, 1); // 移除旧记录
          history.unshift(record); // 添加新记录到开头
        }
      } else {
        history.unshift(record); // 添加新记录到开头
      }
      
      chrome.storage.local.set({history});
    });
  }
  
  // 显示面板按钮
  document.getElementById('show-panel').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "showPanel"}, function(response) {
        if (response && response.success) {
          window.close(); // 关闭弹出窗口
        }
      });
    });
  });
  
  // 绑定发送到飞书按钮事件
  document.getElementById('send-to-feishu').addEventListener('click', function() {
    const videoLink = document.getElementById('video-link').textContent;
    const title = document.getElementById('video-title').textContent;
    
    if (videoLink === '未获取') {
      alert('请先获取视频链接');
      return;
    }
    
    // 检查当前是否已有文案内容
    const currentContent = document.getElementById('video-content').textContent;
    if (currentContent && currentContent !== '点击"获取文案"按钮获取视频文案' && currentContent !== '正在获取文案并推送到飞书...') {
      // 如果已有文案内容，直接发送到飞书
      sendToFeishuWithContent(currentContent, title, videoLink);
      return;
    }
    
    document.getElementById('loading-content').classList.remove('hidden');
    document.getElementById('content-error').classList.add('hidden');
    document.getElementById('video-content').textContent = '正在获取文案并推送到飞书...';
    
    // 从存储中获取API设置
    chrome.storage.sync.get(['douyinApiKey', 'douyinBotId', 'webhookUrl'], function(data) {
      const apiKey = data.douyinApiKey || 'pat_83B92PL17jNaa60C1GuleCCcWrP0FzdYHgjS2wHCF2edVQN8zKt4fp0ic4XCcCCA';
      const botId = data.douyinBotId || '7476121456825663538';
      const webhookUrl = data.webhookUrl;
      
      if (!webhookUrl) {
        alert('请先在设置中配置飞书Webhook URL');
        document.getElementById('loading-content').classList.add('hidden');
        document.getElementById('video-content').textContent = '点击"获取文案"按钮获取视频文案';
        return;
      }
      
      // 通过后台脚本调用API获取文案，避免CORS问题
      chrome.runtime.sendMessage({
        action: "fetchDouyinContent",
        videoUrl: videoLink,
        apiKey: apiKey,
        botId: botId
      }, function(response) {
        if (response && response.success && response.content) {
          const content = response.content;
          document.getElementById('video-content').textContent = content;
          document.getElementById('loading-content').classList.add('hidden');
          document.getElementById('content-error').classList.add('hidden');
          
          // 发送到飞书
          sendToFeishuWithContent(content, title, videoLink);
          
          // 自动保存到历史记录
          saveToHistory();
        } else {
          document.getElementById('loading-content').classList.add('hidden');
          document.getElementById('content-error').classList.remove('hidden');
          document.getElementById('content-error').textContent = `获取文案失败: ${response?.error || '无法获取视频文案，请稍后重试'}`;
          document.getElementById('video-content').textContent = '点击"获取文案"按钮获取视频文案';
        }
      });
    });
  });
  });
  
  // 查看历史按钮
  document.getElementById('history-btn').addEventListener('click', function() {
    chrome.tabs.create({url: chrome.runtime.getURL('options/options.html#history')});
  });
  
  // 设置按钮
  document.getElementById('settings-btn').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
  
  // 帮助按钮
  document.getElementById('help-btn').addEventListener('click', function() {
    chrome.tabs.create({url: 'https://l6uugl8evm.feishu.cn/docx/FLZ5diYaLoCsekx1lDncqdyXnZb?from=from_copylink'});
  });


// 辅助函数：获取视频文案
function fetchVideoContent(videoUrl, apiKey, botId) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "fetchDouyinContent",
      videoUrl: videoUrl,
      apiKey: apiKey,
      botId: botId
    }, function(response) {
      if (response && response.success) {
        resolve(response.content);
      } else {
        reject(new Error(response?.error || '未知错误'));
      }
    });
  });
}

// 辅助函数：分析内容
function analyzeContent(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "analyzeWithAI",
      prompt: prompt,
      apiKey: apiKey
    }, function(response) {
      if (response && response.success) {
        resolve(response.result);
      } else {
        reject(new Error(response?.error || '未知错误'));
      }
    });
  });
}

// 初始化标签页切换
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有标签按钮的active类
      tabBtns.forEach(b => b.classList.remove('active'));
      // 移除所有标签内容的active类
      tabContents.forEach(c => c.classList.remove('active'));
      
      // 添加当前标签按钮的active类
      this.classList.add('active');
      // 添加当前标签内容的active类
      const tabId = this.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });
}
// 发送文案到飞书的函数
function sendToFeishuWithContent(content, title, videoLink) {
  // 从存储中获取webhook URL
  chrome.storage.sync.get(['webhookUrl'], function(data) {
    const webhookUrl = data.webhookUrl;
    
    if (!webhookUrl) {
      alert('请先在设置中配置飞书Webhook URL');
      return;
    }
    
    // 准备发送的数据
    const postData = {
      title: title,
      url: videoLink,
      content: content,
      like: '未获取',
      comment: '未获取',
      collect: '未获取'
    };
    
    // 通过后台脚本发送到飞书webhook，避免CORS问题
    chrome.runtime.sendMessage({
      action: "sendToFeishu",
      webhookUrl: webhookUrl,
      postData: postData
    }, function(response) {
      if (response && response.success) {
        alert('已成功发送到飞书');
      } else {
        alert('发送失败: ' + (response?.error || '未知错误'));
      }
    });
  });
}