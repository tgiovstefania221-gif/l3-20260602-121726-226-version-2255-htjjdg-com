(function () {
  var form = document.querySelector('.big-search');
  var input = document.getElementById('search-page-input');
  var results = document.getElementById('search-results');
  var data = window.SEARCH_MOVIES || [];

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function card(movie) {
    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + escapeHtml(movie.url) + '">' +
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="play-dot">▶</span>' +
      '</a>' +
      '<div class="card-body">' +
      '<div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
      '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.summary) + '</p>' +
      '<div class="tag-row"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.genre.split(/[，,、/]/)[0]) + '</span></div>' +
      '<div class="score-row"><span>评分 ' + escapeHtml(movie.rating) + '</span><a href="' + escapeHtml(movie.url) + '">立即观看</a></div>' +
      '</div>' +
      '</article>';
  }

  function run(query) {
    var q = String(query || '').trim().toLowerCase();
    var items = data;

    if (q) {
      items = data.filter(function (movie) {
        return String(movie.keywords || '').toLowerCase().indexOf(q) !== -1;
      });
    }

    items = items.slice(0, 120);

    if (!items.length) {
      results.innerHTML = '<div class="empty-result">未找到匹配内容</div>';
      return;
    }

    results.innerHTML = items.map(card).join('');
  }

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';

  if (input) {
    input.value = initial;
  }

  if (results) {
    run(initial);
  }

  if (form && input) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var next = input.value.trim();
      var url = new URL(window.location.href);
      if (next) {
        url.searchParams.set('q', next);
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState(null, '', url.toString());
      run(next);
    });

    input.addEventListener('input', function () {
      run(input.value);
    });
  }
})();
