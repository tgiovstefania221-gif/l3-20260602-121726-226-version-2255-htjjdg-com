(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('.play-overlay');
      var errorBox = shell.querySelector('.player-error');
      var url = shell.getAttribute('data-video-url');
      var hls = null;
      var attached = false;

      if (!video || !button || !url) {
        return;
      }

      function showError() {
        if (errorBox) {
          errorBox.hidden = false;
        }
      }

      function attach() {
        if (attached) {
          return Promise.resolve();
        }

        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
          return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              showError();
            }
          });
          return Promise.resolve();
        }

        showError();
        return Promise.reject(new Error('playback unavailable'));
      }

      function play() {
        attach().then(function () {
          video.controls = true;
          button.classList.add('is-hidden');
          var promise = video.play();
          if (promise && promise.catch) {
            promise.catch(function () {
              button.classList.remove('is-hidden');
            });
          }
        }).catch(function () {
          showError();
        });
      }

      button.addEventListener('click', play);
      shell.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          play();
        }
      });

      video.addEventListener('play', function () {
        button.classList.add('is-hidden');
      });

      video.addEventListener('pause', function () {
        if (!video.ended) {
          button.classList.remove('is-hidden');
        }
      });

      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
