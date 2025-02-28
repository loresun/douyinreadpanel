document.addEventListener('DOMContentLoaded', function() {
  // 添加模态框样式
  addModalStyles();
  
  // 初始化标签页切换
  initTabs();
  
  // 加载API设置
  loadApiSettings();
  
  // 加载提示词设置
  loadPromptSettings();
  
  // 加载历史记录
  loadHistory();
  
  // 绑定保存API设置按钮事件
  document.getElementById('save-api-settings').addEventListener('click', saveApiSettings);
  
  // 绑定保存提示词设置按钮事件
  document.getElementById('save-prompt-settings').addEventListener('click', savePromptSettings);
  
  // 绑定重置提示词设置按钮事件
  document.getElementById('reset-prompt-settings').addEventListener('click', resetPromptSettings);
  
  // 绑定清空历史按钮事件
  document.getElementById('clear-history').addEventListener('click', clearHistory);
  
  // 绑定导出历史按钮事件
  document.getElementById('export-history').addEventListener('click', exportHistory);
  
  // 绑定历史搜索框事件
  document.getElementById('history-search').addEventListener('input', searchHistory);
  
  // 检查URL哈希，如果有则切换到对应标签
  checkUrlHash();
});


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
      
      // 更新URL哈希
      window.location.hash = tabId;
    });
  });
  
  // 确保初始加载时正确显示标签内容
  const activeTab = document.querySelector('.tab-btn.active');
  if (activeTab) {
    const tabId = activeTab.getAttribute('data-tab');
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
      tabContent.classList.add('active');
    }
  }
}

// 检查URL哈希，如果有则切换到对应标签
function checkUrlHash() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (tabBtn) {
      tabBtn.click();
    }
  }
}

// 加载API设置
function loadApiSettings() {
  chrome.storage.sync.get(['douyinApiKey', 'douyinBotId', 'aiModelApiKey', 'webhookUrl', 'useToolResponse'], function(data) {
    // 设置默认值或保存的值
    document.getElementById('douyin-api-key').value = data.douyinApiKey || 'pat_83B92PL17jNaa60C1GuleCCcWrP0FzdYHgjS2wHCF2edVQN8zKt4fp0ic4XCcCCA';
    document.getElementById('douyin-bot-id').value = data.douyinBotId || '7476121456825663538187';
    document.getElementById('ai-model-api-key').value = data.aiModelApiKey || '';
    document.getElementById('webhook-url').value = data.webhookUrl || '';
    document.getElementById('use-tool-response').checked = data.useToolResponse !== false; // 默认为true
    
    // 添加默认值提示
    document.getElementById('douyin-api-key').placeholder = '默认: pat_83B92PL17jNaa60C1GuleCCcWrP0FzdYHgjS2wHCF2edVQN8zKt4fp0ic4XCcCCA';
    document.getElementById('douyin-bot-id').placeholder = '默认: 7476121456825663538';
  });
}

// 保存API设置
function saveApiSettings() {
  const douyinApiKey = document.getElementById('douyin-api-key').value;
  const douyinBotId = document.getElementById('douyin-bot-id').value;
  const aiModelApiKey = document.getElementById('ai-model-api-key').value;
  const webhookUrl = document.getElementById('webhook-url').value;
  const useToolResponse = document.getElementById('use-tool-response').checked;
  
  chrome.storage.sync.set({
    douyinApiKey,
    douyinBotId,
    aiModelApiKey,
    webhookUrl,
    useToolResponse
  }, function() {
    const statusElement = document.getElementById('api-settings-status');
    statusElement.textContent = '设置已保存';
    statusElement.classList.add('success');
    
    // 3秒后隐藏状态信息
    setTimeout(function() {
      statusElement.textContent = '';
      statusElement.classList.remove('success');
    }, 3000);
  });
}

// 加载提示词设置
function loadPromptSettings() {
  chrome.storage.sync.get('promptTemplates', function(data) {
    if (data.promptTemplates) {
      document.getElementById('summary-prompt').value = data.promptTemplates.summary;
      document.getElementById('keywords-prompt').value = data.promptTemplates.keywords;
      document.getElementById('rewrite-prompt').value = data.promptTemplates.rewrite;
      document.getElementById('custom-prompt').value = data.promptTemplates.custom;
    } else {
      // 如果没有保存的提示词模板，则使用默认值
      resetPromptSettings();
    }
  });
}

// 保存提示词设置
function savePromptSettings() {
  const summary = document.getElementById('summary-prompt').value;
  const keywords = document.getElementById('keywords-prompt').value;
  const rewrite = document.getElementById('rewrite-prompt').value;
  const custom = document.getElementById('custom-prompt').value;
  
  chrome.storage.sync.set({
    promptTemplates: {
      summary,
      keywords,
      rewrite,
      custom
    }
  }, function() {
    const statusElement = document.getElementById('prompt-settings-status');
    statusElement.textContent = '提示词设置已保存';
    statusElement.classList.add('success');
    
    // 3秒后隐藏状态信息
    setTimeout(function() {
      statusElement.textContent = '';
      statusElement.classList.remove('success');
    }, 3000);
  });
}

// 重置提示词设置为默认值
function resetPromptSettings() {
  const defaultTemplates = {
    summary: "请对以下内容进行摘要：",
    keywords: "请从以下内容中提取关键词：",
    rewrite: "请改写以下文案，使其更吸引人：",
    custom: "请分析以下内容："
  };
  
  document.getElementById('summary-prompt').value = defaultTemplates.summary;
  document.getElementById('keywords-prompt').value = defaultTemplates.keywords;
  document.getElementById('rewrite-prompt').value = defaultTemplates.rewrite;
  document.getElementById('custom-prompt').value = defaultTemplates.custom;
  
  chrome.storage.sync.set({ promptTemplates: defaultTemplates }, function() {
    const statusElement = document.getElementById('prompt-settings-status');
    statusElement.textContent = '已恢复默认提示词设置';
    statusElement.classList.add('success');
    
    // 3秒后隐藏状态信息
    setTimeout(function() {
      statusElement.textContent = '';
      statusElement.classList.remove('success');
    }, 3000);
  });
}

// 加载历史记录
function loadHistory() {
  chrome.storage.local.get('history', function(data) {
    const historyList = document.getElementById('history-list');
    
    if (data.history && data.history.length > 0) {
      // 清空历史列表
      historyList.innerHTML = '';
      
      // 添加历史记录
      data.history.forEach(function(record, index) {
        const historyItem = createHistoryItem(record, index);
        historyList.appendChild(historyItem);
      });
    } else {
      // 显示空历史提示
      historyList.innerHTML = '<div class="empty-history">暂无历史记录</div>';
    }
  });
}

// 创建历史记录项
function createHistoryItem(record, index) {
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  historyItem.setAttribute('data-index', index);
  
  // 格式化日期
  const date = new Date(record.timestamp);
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  historyItem.innerHTML = `
    <div class="history-item-title">${record.title}</div>
    <div class="history-item-date">${formattedDate}</div>
    <div class="history-item-content">${record.content.substring(0, 100)}${record.content.length > 100 ? '...' : ''}</div>
  `;
  
  // 点击历史记录项显示详情
  historyItem.addEventListener('click', function() {
    showHistoryDetail(record);
  });
  
  return historyItem;
}

// 显示历史记录详情
function showHistoryDetail(record) {
  // 创建详情弹窗
  const detailModal = document.createElement('div');
  detailModal.className = 'modal';
  
  // 格式化日期
  const date = new Date(record.timestamp);
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  // 获取分析类型的中文名称
  const analysisTypeMap = {
    summary: '内容摘要',
    keywords: '关键词提取',
    rewrite: '文案改写',
    custom: '自定义分析'
  };
  
  detailModal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${record.title}</h3>
        <span class="modal-close">&times;</span>
      </div>
      <div class="modal-body">
        <p><strong>时间：</strong>${formattedDate}</p>
        <p><strong>链接：</strong><a href="${record.link}" target="_blank">${record.link}</a></p>
        <div class="modal-section">
          <h4>视频文案</h4>
          <div class="modal-content-box">${record.content}</div>
        </div>
        <div class="modal-section">
          <h4>${analysisTypeMap[record.analysisType] || '分析结果'}</h4>
          <div class="modal-content-box">${record.analysis}</div>
        </div>
      </div>
    </div>
  `;
  
  // 添加到页面
  document.body.appendChild(detailModal);
  
  // 添加关闭弹窗事件
  const closeBtn = detailModal.querySelector('.modal-close');
  closeBtn.addEventListener('click', function() {
    document.body.removeChild(detailModal);
  });
  
  // 点击弹窗外部关闭弹窗
  detailModal.addEventListener('click', function(event) {
    if (event.target === detailModal) {
      document.body.removeChild(detailModal);
    }
  });
}

// 搜索历史记录
function searchHistory() {
  const searchText = document.getElementById('history-search').value.toLowerCase();
  
  chrome.storage.local.get('history', function(data) {
    if (!data.history || data.history.length === 0) {
      return;
    }
    
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    const filteredHistory = data.history.filter(record => {
      return record.title.toLowerCase().includes(searchText) || 
             record.content.toLowerCase().includes(searchText) || 
             record.analysis.toLowerCase().includes(searchText);
    });
    
    if (filteredHistory.length > 0) {
      filteredHistory.forEach(function(record, index) {
        const historyItem = createHistoryItem(record, index);
        historyList.appendChild(historyItem);
      });
    } else {
      historyList.innerHTML = '<div class="empty-history">没有找到匹配的记录</div>';
    }
  });
}

// 清空历史记录
function clearHistory() {
  if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
    chrome.storage.local.set({ history: [] }, function() {
      loadHistory();
      alert('历史记录已清空');
    });
  }
}

// 导出历史记录为表格
function exportHistory() {
  chrome.storage.local.get('history', function(data) {
    if (!data.history || data.history.length === 0) {
      alert('没有历史记录可导出');
      return;
    }
    
    // 创建CSV内容
    let csvContent = '标题,链接,文案,分析结果,分析类型,时间\n';
    
    // 添加每条记录
    data.history.forEach(function(record) {
      // 格式化日期
      const date = new Date(record.timestamp);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      // 获取分析类型的中文名称
      const analysisTypeMap = {
        summary: '内容摘要',
        keywords: '关键词提取',
        rewrite: '文案改写',
        custom: '自定义分析'
      };
      
      // 处理CSV中的特殊字符
      const escapeCSV = (text) => {
        if (!text) return '';
        // 如果文本包含逗号、换行符或双引号，则用双引号包裹，并将文本中的双引号替换为两个双引号
        text = text.replace(/"/g, '""');
        if (text.includes(',') || text.includes('\n') || text.includes('"')) {
          return `"${text}"`;
        }
        return text;
      };
      
      // 添加一行记录
      csvContent += [
        escapeCSV(record.title),
        escapeCSV(record.link),
        escapeCSV(record.content),
        escapeCSV(record.analysis),
        escapeCSV(analysisTypeMap[record.analysisType] || '自定义分析'),
        escapeCSV(formattedDate)
      ].join(',') + '\n';
    });
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `抖音阅读助手历史记录_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    // 添加到页面并触发点击
    document.body.appendChild(link);
    link.click();
    
    // 清理
    setTimeout(function() {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  });
}

// 添加弹窗样式
function addModalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      display: block;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      overflow: auto;
    }
    
    .modal-content {
      background-color: white;
      margin: 10% auto;
      padding: 20px;
      border-radius: 8px;
      width: 80%;
      max-width: 700px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    
    .modal-header h3 {
      margin: 0;
      color: #ff0050;
    }
    
    .modal-close {
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      color: #999;
    }
    
    .modal-body {
      margin-bottom: 15px;
    }
    
    .modal-section {
      margin-top: 15px;
    }
    
    .modal-section h4 {
      margin-top: 0;
      margin-bottom: 5px;
      color: #333;
    }
    
    .modal-content-box {
      background-color: #f9f9f9;
      padding: 10px;
      border-radius: 4px;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
  `;
  document.head.appendChild(style);
}