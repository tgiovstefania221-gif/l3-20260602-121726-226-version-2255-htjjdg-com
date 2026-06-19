(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  var carousel = document.querySelector('.hero-carousel');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));

  panels.forEach(function (panel) {
    var keyword = panel.querySelector('[data-card-search]');
    var year = panel.querySelector('[data-year-filter]');
    var genre = panel.querySelector('[data-genre-filter]');
    var target = document.querySelector('.filter-target');

    if (!target) {
      return;
    }

    var cards = Array.prototype.slice.call(target.querySelectorAll('.movie-card, .rank-row'));

    function apply() {
      var q = keyword ? keyword.value.trim().toLowerCase() : '';
      var y = year ? year.value : '';
      var g = genre ? genre.value : '';

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-keywords') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardGenre = card.getAttribute('data-genre') || '';
        var ok = true;

        if (q && text.indexOf(q) === -1) {
          ok = false;
        }

        if (y && cardYear !== y) {
          ok = false;
        }

        if (g && cardGenre.indexOf(g) === -1) {
          ok = false;
        }

        card.classList.toggle('is-hidden-card', !ok);
      });
    }

    [keyword, year, genre].forEach(function (item) {
      if (item) {
        item.addEventListener('input', apply);
        item.addEventListener('change', apply);
      }
    });
  });
})();
