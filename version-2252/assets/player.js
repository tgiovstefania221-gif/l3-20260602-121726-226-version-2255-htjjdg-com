(function () {
  function initPlayer(wrapper) {
    var video = wrapper.querySelector("video");
    var button = wrapper.querySelector("[data-play-button]");
    var stream = wrapper.getAttribute("data-stream");
    var hls = null;
    var ready = false;

    if (!video || !button || !stream) {
      return;
    }

    function playVideo() {
      var promise = video.play();
      wrapper.classList.add("is-playing");
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          wrapper.classList.remove("is-playing");
        });
      }
    }

    function loadVideo() {
      if (ready) {
        playVideo();
        return;
      }
      ready = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
        video.load();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            try {
              hls.destroy();
            } catch (error) {
              hls = null;
            }
            video.src = stream;
            video.addEventListener("loadedmetadata", playVideo, { once: true });
            video.load();
          }
        });
        return;
      }
      video.src = stream;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
      video.load();
    }

    button.addEventListener("click", loadVideo);
    video.addEventListener("click", function () {
      if (!ready || video.paused) {
        loadVideo();
      } else {
        video.pause();
        wrapper.classList.remove("is-playing");
      }
    });
    video.addEventListener("pause", function () {
      if (!video.ended) {
        wrapper.classList.remove("is-playing");
      }
    });
    video.addEventListener("play", function () {
      wrapper.classList.add("is-playing");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(initPlayer);
  });
})();
