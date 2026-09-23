# 游戏开发者讲座档案

用中文整理游戏开发者公开演讲、演示文稿和深度访谈的静态资料库。

在线阅读：<https://ariakrisame.github.io/game-developer-talk-archive/>

本站是个人整理的非官方档案，与 Nexon、Yostar 及各位讲者本人无关。正文是中文整理，不是讲座逐字稿；每篇报告底部提供原始来源链接。

## 本地打开

直接双击根目录的 `index.html`。页面不需要安装依赖，也不需要启动本地服务器。

## 内容结构

- `index.html`：资料库首页、搜索和筛选
- `data/talks.js`：讲座与候选资料
- `reports/`：已经完成的独立报告页
- `assets/styles.css`：全站视觉与响应式样式
- `assets/app.js`：深色模式、搜索、筛选和报告目录

## 新增报告

1. 在 `reports/` 中新增独立 HTML 页面。
2. 在 `data/talks.js` 中加入或更新对应条目。
3. 将条目的 `status` 设为 `report`，并把 `href` 指向报告页面。

所有路径均为相对路径，可部署到 GitHub Pages。
