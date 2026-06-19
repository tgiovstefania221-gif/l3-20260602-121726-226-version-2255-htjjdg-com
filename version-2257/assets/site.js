(function () {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero-slider]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        let currentIndex = 0;

        const showSlide = function (index) {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === currentIndex);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === currentIndex);
            });
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(currentIndex + 1);
            }, 5200);
        }

        showSlide(0);
    }

    const filterCards = function (query) {
        const cards = Array.from(document.querySelectorAll("[data-search]"));
        const emptyState = document.querySelector("[data-empty-state]");
        const normalizedQuery = query.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(function (card) {
            const haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
            const isVisible = !normalizedQuery || haystack.indexOf(normalizedQuery) !== -1;

            card.style.display = isVisible ? "" : "none";

            if (isVisible) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("is-visible", visibleCount === 0);
        }
    };

    const localFilter = document.querySelector("[data-page-filter]");
    const params = new URLSearchParams(window.location.search);
    const currentQuery = params.get("q") || "";

    document.querySelectorAll(".global-search-input").forEach(function (input) {
        if (currentQuery) {
            input.value = currentQuery;
        }
    });

    if (document.body.hasAttribute("data-search-page")) {
        filterCards(currentQuery);
    }

    if (localFilter) {
        const input = localFilter.querySelector("input");

        localFilter.addEventListener("submit", function (event) {
            event.preventDefault();
            filterCards(input.value);
        });

        input.addEventListener("input", function () {
            filterCards(input.value);
        });
    }
})();
