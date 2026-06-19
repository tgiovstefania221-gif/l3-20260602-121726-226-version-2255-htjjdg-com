(function () {
  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-menu-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("active", itemIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function initFilters() {
    var boxes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-box]"));
    boxes.forEach(function (box) {
      var targetSelector = box.getAttribute("data-target") || "#movie-grid";
      var root = document.querySelector(targetSelector);
      if (!root) {
        return;
      }
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-movie-card]"));
      var search = box.querySelector("[data-search]");
      var region = box.querySelector("[data-region]");
      var type = box.querySelector("[data-type]");
      var category = box.querySelector("[data-category]");
      var empty = document.querySelector("[data-empty-state]");

      function matchesSelect(card, field, key) {
        if (!field || field.value === "all") {
          return true;
        }
        return normalize(card.getAttribute(key)).indexOf(normalize(field.value)) !== -1;
      }

      function update() {
        var keyword = normalize(search && search.value);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.textContent
          ].join(" "));
          var ok = true;
          if (keyword && haystack.indexOf(keyword) === -1) {
            ok = false;
          }
          if (!matchesSelect(card, region, "data-region")) {
            ok = false;
          }
          if (!matchesSelect(card, type, "data-type")) {
            ok = false;
          }
          if (category && category.value !== "all" && haystack.indexOf(normalize(category.value)) === -1) {
            ok = false;
          }
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      Array.prototype.slice.call(box.querySelectorAll("input, select")).forEach(function (field) {
        field.addEventListener("input", update);
        field.addEventListener("change", update);
      });
      update();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
