console.log('爱壹帆终极净化器 Pro V3.0 已启动！');

function runPurification() {
    // === 策略一: 移除整个右侧“杂物”侧边栏 ===
    const rightSidebar = document.querySelector('.ps.pggf');
    if (rightSidebar) {
        // 检查一下，如果它还没被移除，就动手
        if (!rightSidebar.hasAttribute('data-cleaned')) {
            console.log('移除右侧信息栏:', rightSidebar);
            rightSidebar.remove();
        }
    }

    // === 策略二: 移除页面其他位置的独立广告 (如下方横幅广告) ===
    const adTipElements = document.querySelectorAll('.gg-tips-text');
    adTipElements.forEach((tip) => {
        // 向上查找最近的 .dabf 容器 (这是下方广告的特征)
        const adContainer = tip.closest('.dabf');
        if (adContainer && !adContainer.hasAttribute('data-cleaned')) {
            console.log('移除独立广告容器:', adContainer);
            adContainer.remove();
        }
    });

    // === 策略三: (预留) 移除视频播放器内的广告遮罩 ===
    const videoAdSelectors = ['.vod-ad-mask', '.vjs-ad-playing'];
    videoAdSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((ad) => {
            if (!ad.hasAttribute('data-cleaned')) {
                console.log('移除视频播放器内广告层:', ad);
                ad.remove();
            }
        });
    });
}

// --- 执行 ---

// 创建一个观察器实例来监视DOM的变化
const observer = new MutationObserver((mutations) => {
    // 当页面有任何变动时，都重新执行净化函数
    runPurification();
});

// 配置观察器
const config = {
    childList: true,
    subtree: true
};

// 启动观察器
observer.observe(document.documentElement, config);

// 为了应对在脚本运行前就加载好的元素，立即执行一次
runPurification();
