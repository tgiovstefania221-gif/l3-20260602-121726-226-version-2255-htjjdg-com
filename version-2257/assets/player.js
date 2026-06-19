import { H as Hls } from "./hls.js";

const attachVideoSource = function (video, sourceUrl) {
    if (!sourceUrl) {
        return Promise.reject(new Error("missing video source"));
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        return Promise.resolve();
    }

    if (Hls && Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });

        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        video.hlsInstance = hls;

        return new Promise(function (resolve) {
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                resolve();
            });
        });
    }

    video.src = sourceUrl;
    return Promise.resolve();
};

document.querySelectorAll("[data-player]").forEach(function (player) {
    const video = player.querySelector("video");
    const button = player.querySelector("[data-play-button]");
    const message = player.querySelector("[data-player-message]");
    let sourceAttached = false;

    const startPlayback = function () {
        const sourceUrl = video.getAttribute("data-src");

        player.classList.add("is-active");

        const ready = sourceAttached ? Promise.resolve() : attachVideoSource(video, sourceUrl);

        ready.then(function () {
            sourceAttached = true;
            return video.play();
        }).catch(function () {
            if (message) {
                message.textContent = "播放连接暂时不可用";
            }
        });
    };

    if (button) {
        button.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
        if (!sourceAttached && video.paused) {
            startPlayback();
        }
    });
});
