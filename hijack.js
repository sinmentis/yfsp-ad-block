(() => {
    const AD_HOST = 'global-cdn.me';
    const MAIN_VIDEO_SEL = 'video#video_player';

    let stopPlayFn = null;

    /* -------- one-time deep search -------- */
    const locateStopPlay = () => {
        if (stopPlayFn) return;
        const players = document.querySelectorAll('aa-videoplayer');
        for (const el of players) {
            const key = Object.keys(el).find((k) =>
                k.startsWith('__ngContext__')
            );
            if (!key) continue;

            const stack = [...el[key]];
            const visited = new Set();

            while (stack.length) {
                const obj = stack.pop();
                if (!obj || typeof obj !== 'object' || visited.has(obj))
                    continue;
                visited.add(obj);

                if (typeof obj.stopPlay === 'function') {
                    stopPlayFn = obj.stopPlay.bind(obj);
                    return;
                }

                let p = Object.getPrototypeOf(obj);
                while (p && p !== Object.prototype) {
                    if (typeof p.stopPlay === 'function') {
                        stopPlayFn = p.stopPlay.bind(obj);
                        return;
                    }
                    p = Object.getPrototypeOf(p);
                }

                for (const k in obj) {
                    const v = obj[k];
                    if (typeof v === 'object' && v) stack.push(v);
                }
            }
        }
    };

    /* try a few times quickly after load */
    [0, 100, 300, 600, 1200, 2500, 4000].forEach((t) =>
        setTimeout(locateStopPlay, t)
    );

    /* -------- intercept play -------- */
    const nativePlay = HTMLVideoElement.prototype.play;

    HTMLVideoElement.prototype.play = function (...args) {
        const src = this.currentSrc || this.src;
        if (src && src.includes(AD_HOST)) {
            stopPlayFn?.();
            queueMicrotask(() => {
                const main = document.querySelector(MAIN_VIDEO_SEL);
                if (main && main !== this)
                    nativePlay.call(main).catch(() => {});
            });
            return Promise.resolve();
        }
        return nativePlay.apply(this, args);
    };

    console.log('Purifier V8 loaded');
})();
