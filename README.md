# AIlong抖音阅读助手

## 项目介绍

AIlong抖音阅读助手是一款Chrome浏览器扩展，专为抖音平台内容创作者、运营人员和研究人员设计。它能够自动获取抖音视频文案，并提供智能分析功能，帮助用户更高效地处理抖音内容。

## 核心功能

### 1. 视频文案获取
- **一键获取**：只需点击"获取文案"按钮，即可自动提取当前抖音视频的完整文案内容
- **自动保存**：所有获取的文案会自动保存到历史记录中，方便后续查看和分析

### 2. 内容智能分析
- **内容摘要**：自动生成视频内容的关键摘要，快速了解核心信息
- **关键词提取**：识别并提取视频文案中的关键词和热点话题
- **文案改写**：智能改写原始文案，提供更具吸引力的表达方式
- **自定义分析**：根据个人需求定制分析方向和内容

### 3. 飞书集成
- **一键推送**：将视频文案和分析结果一键推送到飞书，方便团队协作和内容管理
- **数据同步**：自动同步视频标题、链接、互动数据（点赞、评论、收藏数）等信息

### 4. 便捷操作
- **复制功能**：一键复制视频链接和文案内容
- **历史记录**：自动保存所有分析过的视频信息，支持按时间查看
- **自定义设置**：支持配置API密钥、提示词模板等个性化设置

## 安装方法

1. 下载本项目的ZIP压缩包并解压
2. 打开Chrome浏览器，进入扩展程序页面（chrome://extensions/）
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"，选择解压后的文件夹
5. 安装完成后，在Chrome工具栏可以看到AIlong抖音阅读助手图标

## 使用指南

### 基本使用

1. 打开任意抖音视频页面
2. 点击Chrome工具栏中的AIlong抖音阅读助手图标
3. 在弹出窗口中，点击"获取文案"按钮获取当前视频的文案内容
4. 获取成功后，可以在"文案显示"标签页查看完整文案

### 内容分析

1. 获取文案后，切换到"分析"标签页
2. 从下拉菜单中选择分析类型（内容摘要、关键词提取、文案改写或自定义分析）
3. 点击"分析"按钮，等待分析结果显示

### 推送到飞书

1. 在设置页面配置飞书Webhook URL
2. 在主界面点击"获取文案并推送到飞书"按钮
3. 系统会自动获取文案并将内容推送到配置的飞书群组或频道

## 设置说明

点击插件界面底部的"设置"按钮，可以进入设置页面：

### API设置

- **扣子API密钥**：用于获取抖音视频文案（默认已提供，也可自行配置）
- **扣子Bot ID**：配合API密钥使用（默认已提供）
- **AI模型API密钥**：用于内容分析功能
- **Webhook URL**：飞书机器人的Webhook地址，用于推送内容到飞书
- **Tool Response**：选择是否优先使用API返回的tool_response字段内容

### 提示词设置

可以自定义各类分析功能的提示词模板：

- 内容摘要提示词
- 关键词提取提示词
- 文案改写提示词

## 历史记录

所有获取过的视频文案和分析结果会自动保存到历史记录中，可以通过点击"查看历史"按钮进行查看和管理。

## 技术支持

如需帮助，请点击插件界面底部的"帮助"按钮，或访问在线文档获取更多信息。

---

**AIlong抖音阅读助手** - 让抖音内容创作与分析更高效！