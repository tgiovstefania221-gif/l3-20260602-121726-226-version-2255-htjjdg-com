(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    function initSiteSearch() {
        var forms = document.querySelectorAll("[data-site-search]");
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var value = input ? input.value.trim() : "";
                var target = "./search.html";
                if (value) {
                    target += "?q=" + encodeURIComponent(value);
                }
                window.location.href = target;
            });
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle("active", position === current);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("active", position === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 6200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                restart();
            });
        });
        show(0);
        restart();
    }

    function initRails() {
        var controls = document.querySelectorAll("[data-scroll-target]");
        controls.forEach(function (button) {
            button.addEventListener("click", function () {
                var selector = button.getAttribute("data-scroll-target");
                var rail = document.querySelector(selector);
                if (!rail) {
                    return;
                }
                var direction = button.getAttribute("data-scroll-direction") === "left" ? -1 : 1;
                rail.scrollBy({
                    left: direction * Math.max(280, rail.clientWidth * 0.82),
                    behavior: "smooth"
                });
            });
        });
    }

    function applyFilter(scope) {
        var textInput = scope.querySelector("[data-filter-text]");
        var typeInput = scope.querySelector("[data-filter-type]");
        var yearInput = scope.querySelector("[data-filter-year]");
        var categoryInput = scope.querySelector("[data-filter-category]");
        var query = normalize(textInput && textInput.value);
        var type = normalize(typeInput && typeInput.value);
        var year = normalize(yearInput && yearInput.value);
        var category = normalize(categoryInput && categoryInput.value);
        var cards = scope.querySelectorAll("[data-movie-card]");

        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute("data-search"));
            var cardType = normalize(card.getAttribute("data-type"));
            var cardYear = normalize(card.getAttribute("data-year"));
            var cardCategory = normalize(card.getAttribute("data-category"));
            var visible = true;
            if (query && haystack.indexOf(query) === -1) {
                visible = false;
            }
            if (type && cardType !== type) {
                visible = false;
            }
            if (year && cardYear !== year) {
                visible = false;
            }
            if (category && cardCategory !== category) {
                visible = false;
            }
            card.classList.toggle("is-hidden", !visible);
        });
    }

    function initFilters() {
        var scopes = document.querySelectorAll("[data-filter-scope]");
        scopes.forEach(function (scope) {
            var inputs = scope.querySelectorAll("[data-filter-text], [data-filter-type], [data-filter-year], [data-filter-category]");
            inputs.forEach(function (input) {
                input.addEventListener("input", function () {
                    applyFilter(scope);
                });
                input.addEventListener("change", function () {
                    applyFilter(scope);
                });
            });
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            var textInput = scope.querySelector("[data-filter-text]");
            if (query && textInput) {
                textInput.value = query;
            }
            applyFilter(scope);
        });
    }

    function attachMoviePlayer(streamUrl) {
        var video = document.querySelector("[data-movie-video]");
        var overlay = document.querySelector("[data-play-overlay]");
        if (!video || !streamUrl) {
            return;
        }
        var configured = false;
        var hlsInstance = null;
        var pendingPlay = false;

        function revealVideo() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            video.setAttribute("controls", "controls");
        }

        function playVideo() {
            revealVideo();
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        function configure() {
            if (configured) {
                return;
            }
            configured = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    if (pendingPlay) {
                        playVideo();
                    }
                });
                return;
            }
            video.src = streamUrl;
        }

        function start() {
            pendingPlay = true;
            configure();
            playVideo();
        }

        if (overlay) {
            overlay.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("play", revealVideo);
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    window.attachMoviePlayer = attachMoviePlayer;

    ready(function () {
        initMenu();
        initSiteSearch();
        initHero();
        initRails();
        initFilters();
    });
})();
