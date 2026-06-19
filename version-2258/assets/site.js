(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function updateHeader() {
    var header = qs('[data-header]');
    if (!header) {
      return;
    }
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  function setupMenu() {
    var toggle = qs('[data-menu-toggle]');
    var menu = qs('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
      toggle.textContent = menu.classList.contains('is-open') ? '×' : '☰';
    });
  }

  function setupSearchForms() {
    qsa('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        var action = form.getAttribute('action') || './search.html';
        if (value) {
          window.location.href = action + '?q=' + encodeURIComponent(value);
        } else {
          window.location.href = action;
        }
      });
    });
  }

  function setupHero() {
    var slider = qs('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = qsa('[data-hero-slide]', slider);
    var dots = qsa('[data-hero-dot]', slider);
    var prev = qs('[data-hero-prev]', slider);
    var next = qs('[data-hero-next]', slider);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        play();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        play();
      });
    }

    show(0);
    play();
  }

  function setupCategoryFilter() {
    var panel = qs('[data-filter-panel]');
    var list = qs('[data-filter-list]');
    if (!panel || !list) {
      return;
    }
    var cards = qsa('[data-card]', list);
    var keyword = qs('[data-filter-keyword]', panel);
    var type = qs('[data-filter-type]', panel);
    var year = qs('[data-filter-year]', panel);

    function apply() {
      var q = keyword ? keyword.value.trim().toLowerCase() : '';
      var t = type ? type.value : '';
      var y = year ? year.value : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region')).toLowerCase();
        var ok = true;
        if (q && text.indexOf(q) === -1) {
          ok = false;
        }
        if (t && card.getAttribute('data-type') !== t) {
          ok = false;
        }
        if (y && card.getAttribute('data-year') !== y) {
          ok = false;
        }
        card.style.display = ok ? '' : 'none';
      });
    }

    [keyword, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
  }

  function setupSearchPage() {
    var form = qs('[data-live-search]');
    var results = qs('[data-search-results]');
    if (!form || !results || !window.MOVIE_SEARCH_DATA) {
      return;
    }
    var input = qs('[name="q"]', form);
    var type = qs('[name="type"]', form);
    var year = qs('[name="year"]', form);
    var params = new URLSearchParams(window.location.search);
    if (input && params.get('q')) {
      input.value = params.get('q');
    }

    function render() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var t = type ? type.value : '';
      var y = year ? year.value : '';
      var data = window.MOVIE_SEARCH_DATA.filter(function (item) {
        var text = (item.title + ' ' + item.oneLine + ' ' + item.genre + ' ' + item.region + ' ' + item.tags).toLowerCase();
        if (q && text.indexOf(q) === -1) {
          return false;
        }
        if (t && item.type !== t) {
          return false;
        }
        if (y && item.year !== y) {
          return false;
        }
        return true;
      }).slice(0, 80);

      if (!data.length) {
        results.innerHTML = '<div class="empty-state">没有找到匹配内容</div>';
        return;
      }

      results.innerHTML = data.map(function (item) {
        return '<a class="movie-card card card-hover" href="' + item.url + '">' +
          '<div class="poster-wrap"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy"><span class="duration-badge">' + item.duration + '</span><span class="play-badge">▶</span></div>' +
          '<div class="movie-card-body"><div class="card-topline"><span class="category-pill">' + escapeHtml(item.genreShort) + '</span><span class="rating">★ ' + item.rating + '</span></div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.oneLine) + '</p><div class="movie-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.year) + '</span></div></div>' +
          '</a>';
      }).join('');
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (match) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[match];
      });
    }

    qsa('input, select', form).forEach(function (control) {
      control.addEventListener('input', render);
      control.addEventListener('change', render);
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render();
    });
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateHeader();
    setupMenu();
    setupSearchForms();
    setupHero();
    setupCategoryFilter();
    setupSearchPage();
  });

  window.addEventListener('scroll', updateHeader, { passive: true });
})();
