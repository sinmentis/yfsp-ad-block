// hijack.js V7 – prototype scan & early stopPlay
const pass = () => {};

(() => {
    const AD_HOST = 'global-cdn.me'; // 广告流域名
    const MAIN_VIDEO_SEL = 'video#video_player';

    /* -------- 1. 深度扫描组件树，连同 prototype -------- */
    function findStopPlayInstance() {
        const roots = document.querySelectorAll('aa-videoplayer');
        for (const el of roots) {
            const ctxKey = Object.keys(el).find((k) =>
                k.startsWith('__ngContext__')
            );
            if (!ctxKey) continue;

            const ctx = el[ctxKey];
            const stack = Array.isArray(ctx) ? [...ctx] : [ctx];

            const visited = new Set();
            while (stack.length) {
                const obj = stack.pop();
                if (!obj || typeof obj !== 'object' || visited.has(obj))
                    continue;
                visited.add(obj);

                /* —— 检查实例本身 —— */
                if (typeof obj.stopPlay === 'function') return obj;

                /* —— 检查原型链 —— */
                let p = Object.getPrototypeOf(obj);
                while (p && p !== Object.prototype) {
                    if (typeof p.stopPlay === 'function') return obj;
                    p = Object.getPrototypeOf(p);
                }

                /* —— 继续深搜所有字段 —— */
                for (const k in obj) {
                    try {
                        const v = obj[k];
                        if (typeof v === 'object' && v) stack.push(v);
                    } catch {
                        pass();
                    }
                }
            }
        }
        return null;
    }

    /* -------- 2. 注入拦截逻辑 -------- */
    const nativePlay = HTMLVideoElement.prototype.play;

    HTMLVideoElement.prototype.play = function (...args) {
        /* —— 发现广告流 —— */
        if (this.src && this.src.includes(AD_HOST)) {
            console.debug('[purifier] ad play detected, trying stopPlay');

            const playerInst = findStopPlayInstance();
            if (playerInst) {
                try {
                    playerInst.stopPlay();
                    console.debug('[purifier] stopPlay invoked early 🎉');
                } catch (e) {
                    console.warn('[purifier] stopPlay error', e);
                }
            } else {
                console.warn('[purifier] stopPlay instance not found');
            }

            /* —— 立即恢复主视频 —— */
            setTimeout(() => {
                const main = document.querySelector(MAIN_VIDEO_SEL);
                if (main && main !== this) {
                    try {
                        main.play().catch(() => {});
                    } catch {
                        pass();
                    }
                }
            }, 50);

            return Promise.resolve(); // 广告流被截断
        }

        /* —— 非广告正常播放 —— */
        return nativePlay.apply(this, args);
    };

    console.log('Purifier V7 loaded');
})();
