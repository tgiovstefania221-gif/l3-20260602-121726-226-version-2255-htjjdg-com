(function () {
  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('.player-overlay');
    var start = shell.querySelector('.player-start');
    var sourceElement = video ? video.querySelector('source') : null;
    var source = sourceElement ? sourceElement.getAttribute('src') : '';
    var hls = null;
    var ready = false;

    if (!video || !source) {
      return;
    }

    function bind() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      bind();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    if (start) {
      start.addEventListener('click', function (event) {
        event.stopPropagation();
        play();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
})();
