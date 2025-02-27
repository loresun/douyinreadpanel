// 数据库工具函数

/**
 * 保存历史记录
 * @param {Object} record - 历史记录对象
 * @returns {Promise<void>}
 */
export async function saveHistory(record) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get('history', function(data) {
        const history = data.history || [];
        history.unshift(record);
        chrome.storage.local.set({history}, function() {
          resolve();
        });
      });
    } catch (error) {
      console.error('保存历史记录失败:', error);
      reject(error);
    }
  });
}

/**
 * 获取所有历史记录
 * @returns {Promise<Array>} - 历史记录数组
 */
export async function getAllHistory() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get('history', function(data) {
        resolve(data.history || []);
      });
    } catch (error) {
      console.error('获取历史记录失败:', error);
      reject(error);
    }
  });
}

/**
 * 搜索历史记录
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Array>} - 匹配的历史记录数组
 */
export async function searchHistory(keyword) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get('history', function(data) {
        const history = data.history || [];
        const searchText = keyword.toLowerCase();
        
        const filteredHistory = history.filter(record => {
          return record.title.toLowerCase().includes(searchText) || 
                 record.content.toLowerCase().includes(searchText) || 
                 record.analysis.toLowerCase().includes(searchText);
        });
        
        resolve(filteredHistory);
      });
    } catch (error) {
      console.error('搜索历史记录失败:', error);
      reject(error);
    }
  });
}

/**
 * 清空历史记录
 * @returns {Promise<void>}
 */
export async function clearHistory() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({history: []}, function() {
        resolve();
      });
    } catch (error) {
      console.error('清空历史记录失败:', error);
      reject(error);
    }
  });
}

/**
 * 保存API设置
 * @param {Object} settings - API设置对象
 * @returns {Promise<void>}
 */
export async function saveApiSettings(settings) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set(settings, function() {
        resolve();
      });
    } catch (error) {
      console.error('保存API设置失败:', error);
      reject(error);
    }
  });
}

/**
 * 获取API设置
 * @returns {Promise<Object>} - API设置对象
 */
export async function getApiSettings() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(
        ['douyinApiKey', 'douyinBotId', 'aiModelApiKey'], 
        function(data) {
          resolve({
            douyinApiKey: data.douyinApiKey || '',
            douyinBotId: data.douyinBotId || '',
            aiModelApiKey: data.aiModelApiKey || ''
          });
        }
      );
    } catch (error) {
      console.error('获取API设置失败:', error);
      reject(error);
    }
  });
}

/**
 * 保存提示词模板
 * @param {Object} templates - 提示词模板对象
 * @returns {Promise<void>}
 */
export async function savePromptTemplates(templates) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set({promptTemplates: templates}, function() {
        resolve();
      });
    } catch (error) {
      console.error('保存提示词模板失败:', error);
      reject(error);
    }
  });
}

/**
 * 获取提示词模板
 * @returns {Promise<Object>} - 提示词模板对象
 */
export async function getPromptTemplates() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get('promptTemplates', function(data) {
        const defaultTemplates = {
          summary: "请对以下内容进行摘要：",
          keywords: "请从以下内容中提取关键词：",
          rewrite: "请改写以下文案，使其更吸引人：",
          custom: "请分析以下内容："
        };
        
        resolve(data.promptTemplates || defaultTemplates);
      });
    } catch (error) {
      console.error('获取提示词模板失败:', error);
      reject(error);
    }
  });
}