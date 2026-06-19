(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    var next = hero.querySelector('[data-hero-next]');
    var prev = hero.querySelector('[data-hero-prev]');

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    restart();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-movie-search]'));
  var activeFilter = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filterCards(root) {
    var input = root.querySelector('[data-movie-search]');
    var query = normalize(input ? input.value : '');
    var scope = root.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .ranking-row'));

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.textContent
      ].join(' '));
      var matchText = !query || haystack.indexOf(query) !== -1;
      var matchFilter = activeFilter === 'all' || haystack.indexOf(normalize(activeFilter)) !== -1;
      card.classList.toggle('is-hidden', !(matchText && matchFilter));
    });
  }

  searchInputs.forEach(function (input) {
    var panel = input.closest('.search-panel');
    input.addEventListener('input', function () {
      filterCards(panel);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-filter]')).forEach(function (button) {
    button.addEventListener('click', function () {
      var panel = button.closest('.search-panel');
      activeFilter = button.getAttribute('data-filter') || 'all';
      Array.prototype.slice.call(panel.querySelectorAll('[data-filter]')).forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      filterCards(panel);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var stream = video ? video.getAttribute('data-stream') : '';
    var attached = false;
    var hlsInstance = null;

    function attach() {
      if (!video || !stream || attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      attach();
      player.classList.add('is-playing');
      video.setAttribute('controls', 'controls');
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        play();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
