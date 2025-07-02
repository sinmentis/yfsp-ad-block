(function () {
    console.log('爱壹帆终极净化器 Pro 启动');

    const removeStatic = () => {
        document
            .querySelectorAll('.ps.pggf,.dabf,.gg-tips-text')
            .forEach((el) => el.remove());
    };

    new MutationObserver(removeStatic).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    removeStatic();

    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('hijack.js');
    (document.head || document.documentElement).appendChild(s);
})();
