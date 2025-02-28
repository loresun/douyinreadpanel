// 后台脚本

// 设置CORS请求头，允许跨域请求
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// 监听安装事件
chrome.runtime.onInstalled.addListener(function() {
  // 初始化默认设置
  chrome.storage.sync.get(
    [
      'douyinApiKey', 
      'douyinBotId', 
      'aiModelApiKey', 
      'promptTemplates',
      'useToolResponse'
    ], 
    function(data) {
      // 如果没有设置模板，则设置默认模板
      if (!data.promptTemplates) {
        chrome.storage.sync.set({
          promptTemplates: {
            summary: "请对以下内容进行摘要：",
            keywords: "请从以下内容中提取关键词：",
            rewrite: "请改写以下文案，使其更吸引人：",
            custom: "请分析以下内容："
          }
        });
      }
      
      // 如果没有设置useToolResponse，则默认为true
      if (data.useToolResponse === undefined) {
        chrome.storage.sync.set({
          useToolResponse: true
        });
      }
    }
  );
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getVideoInfo") {
    // 转发消息到内容脚本
    chrome.tabs.sendMessage(sender.tab.id, {action: "getVideoInfo"}, function(response) {
      sendResponse(response);
    });
    return true; // 保持消息通道打开，等待异步响应
  }
  
  // 处理API请求，解决CORS问题
  if (request.action === "fetchDouyinContent") {
    console.log('background收到fetchDouyinContent请求:', request);
    fetchDouyinContent(request.videoUrl, request.apiKey, request.botId)
      .then(content => {
        console.log('成功获取抖音内容');
        sendResponse({success: true, content: content});
      })
      .catch(error => {
        console.error('获取抖音内容失败:', error);
        sendResponse({success: false, error: error.message});
      });
    return true; // 保持消息通道打开，等待异步响应
  }
  
  if (request.action === "analyzeWithAI") {
    analyzeWithAI(request.prompt, request.apiKey)
      .then(result => {
        sendResponse({success: true, result: result});
      })
      .catch(error => {
        sendResponse({success: false, error: error.message});
      });
    return true; // 保持消息通道打开，等待异步响应
  }
  
  // 处理发送到飞书的请求
  if (request.action === "sendToFeishu") {
    sendToFeishu(request.webhookUrl, request.postData)
      .then(() => {
        sendResponse({success: true});
      })
      .catch(error => {
        sendResponse({success: false, error: error.message});
      });
    return true; // 保持消息通道打开，等待异步响应
  }
});

/**
 * 获取抖音视频文案
 * @param {string} videoUrl - 抖音视频链接
 * @param {string} apiKey - 抖音API密钥
 * @param {string} botId - 抖音Bot ID
 * @returns {Promise<string>} - 视频文案
 */
async function fetchDouyinContent(videoUrl, apiKey, botId) {
  try {
    // 使用Coze API获取抖音视频文案
    const response = await fetch('https://api.coze.cn/open_api/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': 'api.coze.cn',
        'Connection': 'keep-alive',
        'Authorization': `Bearer ${apiKey || 'pat_83B92PL17jNaa60C1GuleCCcWrP0FzdYHgjS2wHCF2edVQN8zKt4fp0ic4XCcCCA'}`
      },
      body: JSON.stringify({
        conversation_id: "douyinpanel_" + Date.now(), // 生成唯一会话ID
        bot_id: botId || '7476121456825663538', // 使用默认的bot id
        user: 'douyinpanel_user', // 用户标识
        query: videoUrl, // 发送抖音视频链接作为查询
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Coze API响应数据:', data);
    
    // 检查API响应状态
    if (data.code !== 0) {
      throw new Error(`Coze API错误: ${data.msg || '未知错误'}`);
    }
    
    // 从响应中提取内容
    if (data.messages && data.messages.length > 0) {
      console.log('从messages中提取内容');
      // 查找tool_response类型的消息
      const toolResponseMessage = data.messages.find(msg => msg.type === 'tool_response');
      const assistantMessage = data.messages.find(msg => msg.role === 'assistant' && msg.type !== 'function_call' && msg.type !== 'tool_response');
      
      // 如果找到tool_response消息
      if (toolResponseMessage && toolResponseMessage.content) {
        console.log('发现tool_response消息:', toolResponseMessage);
        // 获取用户设置，决定是否使用tool_response
        const toolResponseContent = toolResponseMessage.content;
        
        return new Promise(resolve => {
          chrome.storage.sync.get('useToolResponse', function(settings) {
            // 如果设置为使用tool_response或未设置（默认为true），则优先使用tool_response
            if (settings.useToolResponse !== false) {
              console.log('使用tool_response字段内容');
              resolve(toolResponseContent);
            } else if (assistantMessage && assistantMessage.content) {
              console.log('根据用户设置，不使用tool_response字段');
              resolve(assistantMessage.content);
            } else {
              // 如果没有普通消息，仍然使用tool_response
              resolve(toolResponseContent);
            }
          });
        });
      } else if (assistantMessage && assistantMessage.content) {
        // 如果没有tool_response但有普通消息
        console.log('使用assistant消息内容:', assistantMessage.content);
        return assistantMessage.content;
      }
      
      // 如果没有找到任何有效消息，返回第一条消息的内容
      console.log('未找到特定类型消息，使用第一条消息内容');
      return data.messages[0].content || '无法获取视频文案';
    } else {
      console.log('无法从响应中提取内容，完整响应:', data);
      throw new Error('无法从API响应中提取有效内容');
    }
  } catch (error) {
    console.error('获取抖音视频文案失败:', error);
    throw error;
  }
}

/**
 * 使用大模型分析内容
 * @param {string} prompt - 提示词
 * @param {string} apiKey - AI模型API密钥
 * @returns {Promise<string>} - 分析结果
 */
async function analyzeWithAI(prompt, apiKey) {
  try {
    // 使用新的API端点和格式
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || '4e6988ab-18dc-4318-9384-d771a4f67010'}`
      },
      body: JSON.stringify({
        model: "deepseek-r1-250120",
        messages: [
          {
            role: "system",
            content: "你是人工智能助手."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 处理包含reasoning和response字段的返回结果
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content;
      // 如果返回的内容包含reasoning和response字段，则进行处理
      if (content.reasoning && content.response) {
        return content.response;
      }
      return content;
    } else {
      throw new Error('API返回结果格式错误');
    }
  } catch (error) {
    console.error('AI分析失败:', error);
    throw error;
  }
}

/**
 * 发送数据到飞书Webhook
 * @param {string} webhookUrl - 飞书Webhook URL
 * @param {Object} postData - 要发送的数据
 * @returns {Promise<void>}
 */
async function sendToFeishu(webhookUrl, postData) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData),
      mode: 'no-cors' // 添加no-cors模式解决CORS问题
    });
    
    // 使用no-cors模式时，response.ok和response.status可能无法正确获取
    // 因此不再检查response.ok，直接返回成功
    return { success: true }; // 简化返回结果
  } catch (error) {
    console.error('发送到飞书失败:', error);
    throw error;
  }
}