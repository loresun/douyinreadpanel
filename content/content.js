// 内容脚本，在抖音网页中执行

// 监听来自popup或background的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getVideoInfo") {
    // 获取视频信息
    const videoInfo = extractVideoInfo();
    sendResponse(videoInfo);
  } else if (request.action === "showPanel") {
    // 显示浮窗面板
    showPanel();
    sendResponse({success: true});
  } else if (request.action === "hidePanel") {
    // 隐藏浮窗面板
    hidePanel();
    sendResponse({success: true});
  }
  return true; // 保持消息通道打开，等待异步响应
});

// 创建浮窗按钮
function createFloatingButton() {
  const floatingBtn = document.createElement('div');
  floatingBtn.className = 'ailong-floating-btn';
  floatingBtn.innerHTML = '<img src="' + chrome.runtime.getURL('assets/icon.png') + '" alt="AIlong" width="32" height="32">';
  floatingBtn.title = 'AIlong抖音阅读助手';
  
  // 添加点击事件，显示面板
  floatingBtn.addEventListener('click', function() {
    showPanel();
  });
  
  // 添加到页面
  document.body.appendChild(floatingBtn);
}

// 提取视频信息的函数
function extractVideoInfo() {
  try {
    let title = "";
    let url = window.location.href;
    let videoId = "";
    let likes = 0;
    let comments = 0;
    let collects = 0;
    
    // 判断当前页面类型
    if (url.includes('/video/')) {
      // 视频详情页
      // 提取视频ID
      const videoIdMatch = url.match(/\/video\/([0-9]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        videoId = videoIdMatch[1];
        // 清理URL，去掉多余参数
        url = `https://www.douyin.com/video/${videoId}`;
      }
      
      // 提取标题 - 详情页标题在特定元素中
      const titleContainer = document.querySelector('.idrZUbq7');
      if (titleContainer) {
        // 获取纯文本内容，去除标签
        const textNodes = [];
        const walk = document.createTreeWalker(titleContainer, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walk.nextNode()) {
          textNodes.push(node.nodeValue.trim());
        }
        title = textNodes.join(' ').trim();
      }
      
      // 尝试获取互动数据
      try {
        // 获取点赞数
        const likeElement = document.querySelector('[data-e2e="like-count"]');
        if (likeElement) {
          likes = parseInteractionCount(likeElement.textContent);
        }
        
        // 获取评论数
        const commentElement = document.querySelector('[data-e2e="comment-count"]');
        if (commentElement) {
          comments = parseInteractionCount(commentElement.textContent);
        }
        
        // 获取收藏数
        const collectElement = document.querySelector('[data-e2e="collect-count"]');
        if (collectElement) {
          collects = parseInteractionCount(collectElement.textContent);
        }
      } catch (e) {
        console.error("获取互动数据失败:", e);
      }
    } else if (url.includes('douyin.com')) {
      // 首页
      // 查找当前活跃视频元素
      const activeVideoElement = document.querySelector('[data-e2e="feed-active-video"]');
      if (activeVideoElement) {
        // 从元素属性中提取视频ID
        videoId = activeVideoElement.getAttribute('data-e2e-vid');
        if (videoId) {
          url = `https://www.douyin.com/video/${videoId}`;
        }
      }
      
      // 提取标题 - 首页标题在特定元素中
      const titleElement = document.querySelector('.arnSiSbK');
      if (titleElement) {
        // 获取纯文本内容，去除标签
        const textNodes = [];
        const walk = document.createTreeWalker(titleElement, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walk.nextNode()) {
          textNodes.push(node.nodeValue.trim());
        }
        title = textNodes.join(' ').trim();
      }
      
      // 尝试获取互动数据
      try {
        // 首页的互动数据可能在不同位置
        const interactionElements = document.querySelectorAll('.video-data-count');
        if (interactionElements.length >= 3) {
          likes = parseInteractionCount(interactionElements[0].textContent);
          comments = parseInteractionCount(interactionElements[1].textContent);
          collects = parseInteractionCount(interactionElements[2].textContent);
        }
      } catch (e) {
        console.error("获取互动数据失败:", e);
      }
    }
    
    return {
      title: title || "未能获取标题",
      url: url,
      videoId: videoId,
      likes: likes,
      comments: comments,
      collects: collects
    };
  } catch (error) {
    console.error("提取视频信息时出错:", error);
    return {
      title: "提取失败",
      url: window.location.href,
      videoId: "",
      likes: 0,
      comments: 0,
      collects: 0
    };
  }
}

// 解析互动数据（处理带单位的数字，如1.2w）
function parseInteractionCount(countText) {
  if (!countText) return 0;
  
  countText = countText.trim();
  
  // 处理万单位
  if (countText.includes('w') || countText.includes('W')) {
    return parseFloat(countText.replace(/[wW]/, '')) * 10000;
  }
  
  // 处理千单位
  if (countText.includes('k') || countText.includes('K')) {
    return parseFloat(countText.replace(/[kK]/, '')) * 1000;
  }
  
  return parseInt(countText) || 0;
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log("AIlong抖音阅读助手已加载");
  // 创建浮窗按钮
  createFloatingButton();
});

// 动态加载content_panel.js和content_panel.css
function loadPanelResources() {
  // 加载JS
  const panelScript = document.createElement('script');
  panelScript.src = chrome.runtime.getURL('content/content_panel.js');
  panelScript.onload = function() {
    console.log('面板脚本加载完成');
  };
  document.head.appendChild(panelScript);
  
  // 加载CSS
  const panelStyle = document.createElement('link');
  panelStyle.rel = 'stylesheet';
  panelStyle.type = 'text/css';
  panelStyle.href = chrome.runtime.getURL('content/content_panel.css');
  document.head.appendChild(panelStyle);
}

// 初始加载资源
loadPanelResources();

// 显示面板函数
function showPanel() {
  console.log('尝试显示面板');
  // 如果window.showPanel存在（由content_panel.js提供），则调用它
  if (typeof window.showPanel === 'function') {
    console.log('调用window.showPanel函数');
    window.showPanel();
    return {success: true};
  } else {
    console.error('面板脚本未加载完成，无法显示面板');
    // 尝试重新加载面板资源
    loadPanelResources();
    
    // 直接创建一个简单的面板，以防content_panel.js未正确加载
    if (!document.getElementById('ailong-floating-panel')) {
      console.log('创建临时面板');
      const panel = document.createElement('div');
      panel.id = 'ailong-floating-panel';
      panel.style.position = 'fixed';
      panel.style.top = '50px';
      panel.style.right = '20px';
      panel.style.width = '300px';
      panel.style.height = '400px';
      panel.style.backgroundColor = 'white';
      panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
      panel.style.zIndex = '9999';
      panel.style.padding = '10px';
      panel.style.borderRadius = '5px';
      panel.innerHTML = '<h3>AIlong抖音阅读助手</h3><p>面板加载中...</p>';
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '关闭';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '10px';
      closeBtn.addEventListener('click', function() {
        panel.style.display = 'none';
      });
      
      panel.appendChild(closeBtn);
      document.body.appendChild(panel);
    }
    
    // 延迟一段时间后再次尝试显示面板
    setTimeout(() => {
      if (typeof window.showPanel === 'function') {
        console.log('延迟后调用window.showPanel函数');
        window.showPanel();
      } else {
        console.error('无法加载面板脚本');
        // 显示已创建的临时面板
        const panel = document.getElementById('ailong-floating-panel');
        if (panel) {
          panel.style.display = 'block';
        }
      }
    }, 1000);
    
    return {success: true};
  }
}

// 隐藏面板函数
function hidePanel() {
  // 如果window.hidePanel存在（由content_panel.js提供），则调用它
  if (typeof window.hidePanel === 'function') {
    window.hidePanel();
  } else {
    console.error('面板脚本未加载完成，无法隐藏面板');
  }
}

// 导出函数到全局，供面板脚本使用
window.extractVideoInfo = extractVideoInfo;