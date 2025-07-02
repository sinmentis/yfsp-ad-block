# README — 爱壹帆终极净化器 插件说明

_(Chrome Extension – Ad & Mid-roll Blocker for [yfsp.tv](https://www.yfsp.tv))_

---

## 目录

1.  [功能速览](#%E5%8A%9F%E8%83%BD%E9%80%9F%E8%A7%88)

2.  [快速安装](#%E5%BF%AB%E9%80%9F%E5%AE%89%E8%A3%85)

3.  [源码结构](#%E6%BA%90%E7%A0%81%E7%BB%93%E6%9E%84)

4.  [关键实现](#%E5%85%B3%E9%94%AE%E5%AE%9E%E7%8E%B0)

5.  [常见问题](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)

6.  [二次开发 & 调试](#%E4%BA%8C%E6%AC%A1%E5%BC%80%E5%8F%91--%E8%B0%83%E8%AF%95)

---

## 功能速览

| 功能                | 描述                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| **秒杀 Mid-roll**   | 通过原型链扫描缓存 `stopPlay()` 并在广告 `<video>` 触发时即时调用，**0-1 s 内跳过**，无黑屏、无静音残留 |
| **静态广告清理**    | DOM MutationObserver + 选择器批量移除侧栏、下方横幅等静态广告元素                                       |
| **零请求拦截**      | 不再屏蔽网络层媒体流，保证播放器逻辑完整，避免 `ERR_BLOCKED_BY_CLIENT`                                  |
| **免配置 / 免刷新** | 内容脚本 `document_start` 注入，页面首次加载即生效                                                      |

---

## 快速安装

1.  克隆或下载本仓库。

2.  打开 **Chrome → 扩展程序 → 开发者模式**。

3.  点击 **“加载已解压的扩展程序”**，选择 `dist/`（或源码根目录）。

4.  刷新 yfsp.tv，观察 DevTools Console 出现

    ```lua
    爱壹帆终极净化器 启动
    Purifier loaded
    ```

    即表示运行成功。

---

## 源码结构

```bash
.
├── manifest.json        # MV3 清单
├── background.js        # 仅清空动态拦截规则
├── content.js           # 静态广告 MutationObserver + 注入 hijack 脚本
└── hijack.js            # Mid-roll 拦截 & stopPlay 调用（核心）
```

| 文件            | 作用                                           | 运行时环境     |
| --------------- | ---------------------------------------------- | -------------- |
| `manifest.json` | 权限声明 & 入口定义                            | —              |
| `background.js` | **移除** 旧版动态 DNR 规则（不再屏蔽媒体 URL） | Service Worker |
| `content.js`    | ① 移除静态 DOM 广告                            |
| `hijack.js`     | ① 深度缓存 `stopPlay`                          |
