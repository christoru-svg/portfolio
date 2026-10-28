/* Animations de la page d'accueil.
   - Titres de section révélés mot par mot.
   - Méthode : l'étape au centre de l'écran s'active et joue sa mini-scène
     (épinglée pendant le scroll sur grand écran).
   - IA : barres avant / après pour le temps gagné.
   Si l'utilisateur demande de réduire les animations, rien ne s'exécute
   et la page s'affiche telle quelle. */

(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var en = document.documentElement.lang === "en";
  document.documentElement.classList.add("motion");

  /* ---------- Titres de section ---------- */
  document.querySelectorAll(".section__title").forEach(function (title) {
    var text = title.textContent.trim();
    title.setAttribute("aria-label", text);
    title.textContent = "";
    text.split(/\s+/).forEach(function (word, i, words) {
      var span = document.createElement("span");
      span.className = "word";
      span.setAttribute("aria-hidden", "true");
      span.style.transitionDelay = i * 70 + "ms";
      span.textContent = word;
      title.appendChild(span);
      if (i < words.length - 1) title.appendChild(document.createTextNode(" "));
    });
    title.setAttribute("data-reveal", "");
  });

  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      reveal.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -15% 0px" });

  document.querySelectorAll("[data-reveal], .gain").forEach(function (el) { reveal.observe(el); });

  /* ---------- Méthode : mini-scènes ---------- */
  function add(parent, className, styles) {
    var el = document.createElement("span");
    el.className = className;
    for (var key in styles) el.style.setProperty(key, styles[key]);
    parent.appendChild(el);
    return el;
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  var scenes = {
    // Des post-its épars qui se regroupent en 3 thèmes
    discovery: function (scene) {
      for (var i = 0; i < 9; i++) {
        var theme = i % 3, row = Math.floor(i / 3);
        add(scene, "postit postit--" + (theme + 1), {
          "--sx": rand(6, 82) + "%",
          "--sy": rand(10, 88) + "px",
          "--gx": 10 + theme * 31 + "%",
          "--gy": 18 + row * 26 + "px",
          "transition-delay": i * 40 + "ms"
        });
      }
    },
    // Des blocs qui s'assemblent en wireframe
    conception: function (scene) {
      for (var i = 1; i <= 4; i++) add(scene, "wf wf--" + i, {});
    },
    // Le backlog se range en 3 lots, le lot 1 passe en production
    delivery: function (scene) {
      for (var c = 0; c < 3; c++) {
        add(scene, "lot", { left: 4 + c * 32 + "%" });
        add(scene, "lot__label", { left: 4 + c * 32 + "%" }).textContent = (en ? "Release " : "Lot ") + (c + 1);
      }
      [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [2, 0], [2, 1]].forEach(function (slot) {
        add(scene, "ticket" + (slot[0] === 0 ? " ticket--live" : ""), {
          "--sx": rand(10, 75) + "%",
          "--sy": rand(26, 80) + "px",
          "--gx": "calc(" + (4 + slot[0] * 32) + "% + 8px)",
          "--gy": 32 + slot[1] * 17 + "px"
        });
      });
      add(scene, "scene__note", {}).textContent = "SUS 85 → 89";
    }
  };

  document.querySelectorAll(".scene[data-scene]").forEach(function (scene) {
    var build = scenes[scene.dataset.scene];
    if (build) build(scene);
  });

  /* ---------- Méthode : étape active au scroll ---------- */
  var section = document.querySelector(".steps-section");
  if (!section) return;

  var track = section.querySelector(".steps-track");
  var steps = section.querySelector(".steps");
  var cards = Array.prototype.slice.call(steps.children);
  var pinMedia = window.matchMedia("(min-width: 1001px) and (min-height: 820px)");
  var current = null;
  var ticking = false;

  function activeIndex() {
    var vh = window.innerHeight;

    if (pinMedia.matches) {
      var rect = track.getBoundingClientRect();
      if (rect.top > vh * 0.4 || rect.bottom < 0) return -1;
      var progress = -rect.top / (rect.height - vh);
      return progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;
    }

    // Cartes empilées : celle dont le centre est le plus proche du centre de l'écran
    var best = -1, bestDistance = vh * 0.45;
    cards.forEach(function (card, i) {
      var r = card.getBoundingClientRect();
      var distance = Math.abs(r.top + r.height / 2 - vh / 2);
      if (distance < bestDistance) { bestDistance = distance; best = i; }
    });
    return best;
  }

  function update() {
    ticking = false;
    var index = activeIndex();
    if (index === current) return;
    current = index;
    steps.classList.toggle("has-active", index >= 0);
    cards.forEach(function (card, i) { card.classList.toggle("is-active", i === index); });
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function setPinned() {
    section.classList.toggle("is-pinned", pinMedia.matches);
    current = null;
    requestUpdate();
  }

  if (pinMedia.addEventListener) pinMedia.addEventListener("change", setPinned);
  else pinMedia.addListener(setPinned);
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  setPinned();
})();
