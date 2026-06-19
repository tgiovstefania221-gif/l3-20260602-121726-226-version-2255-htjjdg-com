(function () {
    function attachPlayer(box) {
        var video = box.querySelector('video');
        var button = box.querySelector('.play-cover');
        if (!video) {
            return;
        }

        var source = video.getAttribute('data-video');
        var prepared = false;
        var hlsInstance = null;

        function prepare() {
            if (prepared || !source) {
                return;
            }
            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (_, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hlsInstance.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hlsInstance.recoverMediaError();
                    } else {
                        hlsInstance.destroy();
                    }
                });
                return;
            }

            video.src = source;
        }

        function playVideo() {
            prepare();
            box.classList.add('is-playing');
            var result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {
                    box.classList.remove('is-playing');
                });
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener('play', function () {
            box.classList.add('is-playing');
        });

        video.addEventListener('pause', function () {
            if (!video.seeking) {
                box.classList.remove('is-playing');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(attachPlayer);
})();
