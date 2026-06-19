(function () {
    var navButton = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (navButton && mobileNav) {
        navButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var next = hero.querySelector('[data-hero-next]');
        var prev = hero.querySelector('[data-hero-prev]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startTimer();
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var searchInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var activeFilter = '';

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function applyFilters() {
        var query = normalize(searchInput ? searchInput.value : '');
        var filterValue = normalize(activeFilter);

        cards.forEach(function (card) {
            var text = normalize((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '') + ' ' + card.textContent);
            var queryMatch = !query || text.indexOf(query) !== -1;
            var filterMatch = !filterValue || text.indexOf(filterValue) !== -1;
            card.classList.toggle('hidden-by-filter', !(queryMatch && filterMatch));
        });
    }

    if (searchInput && cards.length) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (initialQuery) {
            searchInput.value = initialQuery;
        }
        searchInput.addEventListener('input', applyFilters);
        applyFilters();
    }

    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (item) {
                item.classList.remove('active');
            });
            chip.classList.add('active');
            activeFilter = chip.getAttribute('data-filter') || '';
            applyFilters();
        });
    });
})();
