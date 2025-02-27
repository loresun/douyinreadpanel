// API工具函数

/**
 * 获取抖音视频文案
 * @param {string} videoUrl - 抖音视频链接
 * @param {string} apiKey - 抖音API密钥
 * @param {string} botId - 抖音Bot ID
 * @returns {Promise<string>} - 视频文案
 */
export async function fetchDouyinContent(videoUrl, apiKey, botId) {
  try {
    // 使用Coze API获取抖音视频文案
    const response = await fetch('https://api.coze.cn/open_api/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': 'api.coze.cn',
        'Connection': 'keep-alive',
        'Authorization': `Bearer ${apiKey || 'pat_hZ6doHmuliB7dWwl7AWn9vJ1S91VyjJ0LgYIN6kSZb8TUqEiHg4Cv9DJaSRB1MMT'}`
      },
      body: JSON.stringify({
        conversation_id: "douyinpanel_" + Date.now(), // 生成唯一会话ID
        bot_id: botId || '7474274929681842187', // 使用默认的bot id
        user: 'douyinpanel_user', // 用户标识
        query: videoUrl, // 发送抖音视频链接作为查询
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 检查API响应状态
    if (data.code !== 0) {
      throw new Error(`Coze API错误: ${data.msg || '未知错误'}`);
    }
    
    // 从响应中提取内容
    if (data.messages && data.messages.length > 0) {
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
        return assistantMessage.content;
      }
      
      // 如果没有找到任何有效消息，返回第一条消息的内容
      return data.messages[0].content || '无法获取视频文案';
    } else {
      // 如果没有找到任何消息
      return '无法获取视频文案';
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
export async function analyzeWithAI(prompt, apiKey) {
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