// 浮窗面板脚本

// 创建浮窗面板
function createPanel() {
  // 检查是否已存在面板
  if (document.getElementById('ailong-floating-panel')) {
    return;
  }
  
  // 创建面板容器
  const panel = document.createElement('div');
  panel.id = 'ailong-floating-panel';
  panel.className = 'ailong-floating-panel';
  
  // 创建面板头部
  const panelHeader = document.createElement('div');
  panelHeader.className = 'ailong-panel-header';
  
  // 创建标题
  const panelTitle = document.createElement('h3');
  panelTitle.className = 'ailong-panel-title';
  panelTitle.textContent = 'AIlong抖音阅读助手';
  
  // 创建关闭按钮
  const closeButton = document.createElement('span');
  closeButton.className = 'ailong-panel-close';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', function() {
    hidePanel();
  });
  
  // 组装头部
  panelHeader.appendChild(panelTitle);
  panelHeader.appendChild(closeButton);
  
  // 创建标签页容器
  const tabContainer = document.createElement('div');
  tabContainer.className = 'ailong-tab-container';
  
  // 创建标签页按钮
  const tabButtons = document.createElement('div');
  tabButtons.className = 'ailong-tab-buttons';
  
  const contentTabBtn = document.createElement('button');
  contentTabBtn.className = 'ailong-tab-btn active';
  contentTabBtn.setAttribute('data-tab', 'content-tab');
  contentTabBtn.textContent = '文案显示';
  
  const analysisTabBtn = document.createElement('button');
  analysisTabBtn.className = 'ailong-tab-btn';
  analysisTabBtn.setAttribute('data-tab', 'analysis-tab');
  analysisTabBtn.textContent = '分析';
  
  // 添加标签页按钮点击事件
  contentTabBtn.addEventListener('click', function() {
    switchTab('content-tab');
  });
  
  analysisTabBtn.addEventListener('click', function() {
    switchTab('analysis-tab');
  });
  
  // 组装标签页按钮
  tabButtons.appendChild(contentTabBtn);
  tabButtons.appendChild(analysisTabBtn);
  
  // 创建标签页内容
  const tabContents = document.createElement('div');
  tabContents.className = 'ailong-tab-contents';
  
  // 创建文案显示标签页
  const contentTab = document.createElement('div');
  contentTab.id = 'content-tab';
  contentTab.className = 'ailong-tab-content active';
  
  // 创建视频信息区域
  const videoInfo = document.createElement('div');
  videoInfo.className = 'ailong-video-info';
  
  const videoTitle = document.createElement('p');
  videoTitle.id = 'panel-video-title';
  videoTitle.textContent = '未获取标题';
  
  const videoLink = document.createElement('p');
  videoLink.id = 'panel-video-link';
  videoLink.textContent = '未获取链接';
  
  videoInfo.appendChild(videoTitle);
  videoInfo.appendChild(videoLink);
  
  // 创建文案内容区域
  const contentArea = document.createElement('div');
  contentArea.className = 'ailong-content-area';
  
  const contentLoading = document.createElement('div');
  contentLoading.id = 'panel-loading-content';
  contentLoading.className = 'ailong-loading hidden';
  contentLoading.textContent = '正在获取文案...';
  
  const contentError = document.createElement('div');
  contentError.id = 'panel-content-error';
  contentError.className = 'ailong-error hidden';
  contentError.textContent = '获取文案失败';
  
  const videoContent = document.createElement('div');
  videoContent.id = 'panel-video-content';
  videoContent.className = 'ailong-video-content';
  videoContent.textContent = '点击"获取文案"按钮获取视频文案';
  
  contentArea.appendChild(contentLoading);
  contentArea.appendChild(contentError);
  contentArea.appendChild(videoContent);
  
  // 组装文案显示标签页
  contentTab.appendChild(videoInfo);
  contentTab.appendChild(contentArea);
  
  // 创建分析标签页
  const analysisTab = document.createElement('div');
  analysisTab.id = 'analysis-tab';
  analysisTab.className = 'ailong-tab-content';
  
  // 创建分析选项
  const analysisOptions = document.createElement('div');
  analysisOptions.className = 'ailong-analysis-options';
  
  const analysisType = document.createElement('select');
  analysisType.id = 'panel-analysis-type';
  
  const summaryOption = document.createElement('option');
  summaryOption.value = 'summary';
  summaryOption.textContent = '内容摘要';
  
  const keywordsOption = document.createElement('option');
  keywordsOption.value = 'keywords';
  keywordsOption.textContent = '关键词提取';
  
  const rewriteOption = document.createElement('option');
  rewriteOption.value = 'rewrite';
  rewriteOption.textContent = '文案改写';
  
  const customOption = document.createElement('option');
  customOption.value = 'custom';
  customOption.textContent = '自定义分析';
  
  analysisType.appendChild(summaryOption);
  analysisType.appendChild(keywordsOption);
  analysisType.appendChild(rewriteOption);
  analysisType.appendChild(customOption);
  
  const analyzeBtn = document.createElement('button');
  analyzeBtn.id = 'panel-analyze-btn';
  analyzeBtn.className = 'ailong-btn';
  analyzeBtn.textContent = '分析';
  
  analysisOptions.appendChild(analysisType);
  analysisOptions.appendChild(analyzeBtn);
  
  // 创建分析结果区域
  const analysisLoading = document.createElement('div');
  analysisLoading.id = 'panel-loading-analysis';
  analysisLoading.className = 'ailong-loading hidden';
  analysisLoading.textContent = '分析中...';
  
  const analysisError = document.createElement('div');
  analysisError.id = 'panel-analysis-error';
  analysisError.className = 'ailong-error hidden';
  analysisError.textContent = '分析失败';
  
  const analysisResult = document.createElement('div');
  analysisResult.id = 'panel-analysis-result';
  analysisResult.className = 'ailong-analysis-result';
  analysisResult.textContent = '选择分析类型并点击"分析"按钮';
  
  // 组装分析标签页
  analysisTab.appendChild(analysisOptions);
  analysisTab.appendChild(analysisLoading);
  analysisTab.appendChild(analysisError);
  analysisTab.appendChild(analysisResult);
  
  // 组装标签页内容
  tabContents.appendChild(contentTab);
  tabContents.appendChild(analysisTab);
  
  // 组装标签页容器
  tabContainer.appendChild(tabButtons);
  tabContainer.appendChild(tabContents);
  
  // 创建顶部按钮区域
  const topButtons = document.createElement('div');
  topButtons.className = 'ailong-top-buttons';
  
  const getContentBtn = document.createElement('button');
  getContentBtn.id = 'panel-get-content';
  getContentBtn.className = 'ailong-btn';
  getContentBtn.textContent = '获取文案';
  
  const sendToFeishuBtn = document.createElement('button');
  sendToFeishuBtn.id = 'panel-send-to-feishu';
  sendToFeishuBtn.className = 'ailong-btn';
  sendToFeishuBtn.textContent = '获取文案并推送到飞书';
  
  topButtons.appendChild(getContentBtn);
  topButtons.appendChild(sendToFeishuBtn);
  
  // 创建底部按钮区域
  const bottomButtons = document.createElement('div');
  bottomButtons.className = 'ailong-bottom-buttons';
  
  const settingsBtn = document.createElement('button');
  settingsBtn.id = 'panel-settings-btn';
  settingsBtn.className = 'ailong-btn';
  settingsBtn.textContent = '设置';
  
  const historyBtn = document.createElement('button');
  historyBtn.id = 'panel-history-btn';
  historyBtn.className = 'ailong-btn';
  historyBtn.textContent = '查看历史';
  
  const helpBtn = document.createElement('button');
  helpBtn.id = 'panel-help-btn';
  helpBtn.className = 'ailong-btn';
  helpBtn.textContent = '帮助';
  
  bottomButtons.appendChild(settingsBtn);
  bottomButtons.appendChild(historyBtn);
  bottomButtons.appendChild(helpBtn);
  
  // 组装面板
  panel.appendChild(panelHeader);
  panel.appendChild(topButtons);
  panel.appendChild(tabContainer);
  panel.appendChild(bottomButtons);
  
  // 添加到页面
  document.body.appendChild(panel);
  
  // 绑定事件
  bindPanelEvents();
  
  // 获取视频信息
  updatePanelVideoInfo();
}

// 切换标签页
function switchTab(tabId) {
  // 移除所有标签按钮的active类
  const tabBtns = document.querySelectorAll('.ailong-tab-btn');
  tabBtns.forEach(btn => btn.classList.remove('active'));
  
  // 移除所有标签内容的active类
  const tabContents = document.querySelectorAll('.ailong-tab-content');
  tabContents.forEach(content => content.classList.remove('active'));
  
  // 添加当前标签按钮的active类
  document.querySelector(`.ailong-tab-btn[data-tab="${tabId}"]`).classList.add('active');
  
  // 添加当前标签内容的active类
  document.getElementById(tabId).classList.add('active');
}

// 显示面板
function showPanel() {
  // 如果面板不存在，则创建
  if (!document.getElementById('ailong-floating-panel')) {
    createPanel();
  }
  
  // 显示面板
  const panel = document.getElementById('ailong-floating-panel');
  panel.style.display = 'block';
}

// 隐藏面板
function hidePanel() {
  const panel = document.getElementById('ailong-floating-panel');
  if (panel) {
    panel.style.display = 'none';
  }
}

// 更新面板中的视频信息
function updatePanelVideoInfo() {
  const videoInfo = extractVideoInfo();
  
  document.getElementById('panel-video-title').textContent = videoInfo.title;
  document.getElementById('panel-video-link').textContent = videoInfo.url;
}

// 绑定面板事件
function bindPanelEvents() {
  // 获取文案按钮
  document.getElementById('panel-get-content').addEventListener('click', function() {
    getVideoContent();
  });
  
  // 获取文案并推送到飞书按钮
  document.getElementById('panel-send-to-feishu').addEventListener('click', function() {
    getVideoContentAndSendToFeishu();
  });
  
  // 分析按钮
  document.getElementById('panel-analyze-btn').addEventListener('click', function() {
    analyzeVideoContent();
  });
  
  // 设置按钮
  document.getElementById('panel-settings-btn').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
  
  // 查看历史按钮
  document.getElementById('panel-history-btn').addEventListener('click', function() {
    chrome.tabs.create({url: chrome.runtime.getURL('options/options.html#history')});
  });
  
  // 帮助按钮
  document.getElementById('panel-help-btn').addEventListener('click', function() {
    chrome.tabs.create({url: 'https://l6uugl8evm.feishu.cn/docx/FLZ5diYaLoCsekx1lDncqdyXnZb?from=from_copylink'});
  });
}

// 获取视频文案
function getVideoContent() {
  const videoLink = document.getElementById('panel-video-link').textContent;
  if (videoLink === '未获取链接') {
    alert('请先获取视频链接');
    return;
  }
  
  document.getElementById('panel-loading-content').classList.remove('hidden');
  document.getElementById('panel-content-error').classList.add('hidden');
  document.getElementById('panel-video-content').textContent = '正在获取文案...';
  
  // 从存储中获取API设置
  chrome.storage.sync.get(['douyinApiKey', 'douyinBotId'], function(data) {
    const apiKey = data.douyinApiKey || 'pat_83B92PL17jNaa60C1GuleCCcWrP0FzdYHgjS2wHCF2edVQN8zKt4fp0ic4XCcCCA';
    const botId = data.douyinBotId || '7476121456825663538';
    
    // 通过后台脚本调用API获取文案，避免CORS问题
    chrome.runtime.sendMessage({
      action: "fetchDouyinContent",
      videoUrl: videoLink,
      apiKey: apiKey,
      botId: botId
    }, function(response) {
      if (response && response.success && response.content) {
        document.getElementById('panel-video-content').textContent = response.content;
        document.getElementById('panel-loading-content').classList.add('hidden');
        document.getElementById('panel-content-error').classList.add('hidden');
      } else {
        document.getElementById('panel-loading-content').classList.add('hidden');
        document.getElementById('panel-content-error').classList.remove('hidden');
        document.getElementById('panel-content-error').textContent = `获取文案失败: ${response?.error || '无法获取视频文案，请稍后重试'}`;
        document.getElementById('panel-video-content').textContent = '点击"获取文案"按钮获取视频文案';
      }
    });
  });
}

// 获取文案并推送到飞书
function getVideoContentAndSendToFeishu() {
  const videoLink = document.getElementById('panel-video-link').textContent;
  if (videoLink === '未获取链接') {
    alert('请先获取视频链接');
    return;
  }
  
  // 获取视频信息
  const videoInfo = extractVideoInfo();
  const title = videoInfo.title;
  const url = videoInfo.url;
  const likes = videoInfo.likes;
  const comments = videoInfo.comments;
  const collects = videoInfo.collects;
  
  // 检查当前是否已有文案内容
  const currentContent = document.getElementById('panel-video-content').textContent;
  if (currentContent && currentContent !== '点击"获取文案"按钮获取视频文案' && currentContent !== '正在获取文案并推送到飞书...') {
    // 如果已有文案内容，直接发送到飞书
    sendContentToFeishu(currentContent, title, url, likes, comments, collects);
    return;
  }
  
  document.getElementById('panel-loading-content').classList.remove('hidden');
  document.getElementById('panel-content-error').classList.add('hidden');
  document.getElementById('panel-video-content').textContent = '正在获取文案并推送到飞书...';
  
  // 从存储中获取API设置
  chrome.storage.sync.get(['douyinApiKey', 'douyinBotId', 'webhookUrl'], function(data) {
    const apiKey = data.douyinApiKey || 'pat_83B92PL17jNaa60C1GuleCCcWrP0FzdYHgjS2wHCF2edVQN8zKt4fp0ic4XCcCCA';
    const botId = data.douyinBotId || '7476121456825663538';
    const webhookUrl = data.webhookUrl;
    
    if (!webhookUrl) {
      alert('请先在设置中配置飞书Webhook URL');
      document.getElementById('panel-loading-content').classList.add('hidden');
      document.getElementById('panel-video-content').textContent = '点击"获取文案"按钮获取视频文案';
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
        document.getElementById('panel-video-content').textContent = content;
        document.getElementById('panel-loading-content').classList.add('hidden');
        document.getElementById('panel-content-error').classList.add('hidden');
        
        // 发送到飞书
        sendContentToFeishu(content, title, url, likes, comments, collects);
      } else {
        document.getElementById('panel-loading-content').classList.add('hidden');
        document.getElementById('panel-content-error').classList.remove('hidden');
        document.getElementById('panel-content-error').textContent = `获取文案失败: ${response?.error || '无法获取视频文案，请稍后重试'}`;
        document.getElementById('panel-video-content').textContent = '点击"获取文案"按钮获取视频文案';
      }
    });
  });
}

// 辅助函数：发送内容到飞书
function sendContentToFeishu(content, title, url, likes, comments, collects) {
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
      url: url,
      content: content,
      like: likes,
      comment: comments,
      collect: collects
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

// 分析视频文案
function analyzeVideoContent() {
  const content = document.getElementById('panel-video-content').textContent;
  if (content === '点击"获取文案"按钮获取视频文案') {
    alert('请先获取视频文案');
    return;
  }
  
  const analysisType = document.getElementById('panel-analysis-type').value;
  
  document.getElementById('panel-loading-analysis').classList.remove('hidden');
  document.getElementById('panel-analysis-error').classList.add('hidden');
  
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
        document.getElementById('panel-analysis-result').textContent = response.result;
        document.getElementById('panel-loading-analysis').classList.add('hidden');
        
        // 保存到历史记录
        saveToHistory();
      } else {
        document.getElementById('panel-loading-analysis').classList.add('hidden');
        document.getElementById('panel-analysis-error').classList.remove('hidden');
        document.getElementById('panel-analysis-error').textContent = `分析失败: ${response?.error || '未知错误'}`;
      }
    });
  });
}

// 保存到历史记录的函数
function saveToHistory() {
  const videoInfo = extractVideoInfo();
  const title = videoInfo.title;
  const link = videoInfo.url;
  const content = document.getElementById('panel-video-content').textContent;
  const analysis = document.getElementById('panel-analysis-result').textContent;
  const analysisType = document.getElementById('panel-analysis-type').value;
  
  if (title === '未能获取标题' || content === '点击"获取文案"按钮获取视频文案') {
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

// 导出函数，供content.js调用
window.showPanel = showPanel;
window.hidePanel = hidePanel;