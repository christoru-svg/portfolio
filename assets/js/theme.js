/* Menu du haut : bouton clair / sombre, et menu mobile qui regroupe
   le thème, la langue et LinkedIn.
   Le thème de départ est posé par le petit script dans le <head> de chaque page
   (choix enregistré, sinon réglage du système). */
(function () {
  var root = document.documentElement;
  var en = root.lang === "en";

  /* ---------- Clair / sombre ---------- */
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    var text = toggle.querySelector(".nav__label");

    var sync = function () {
      var dark = root.dataset.theme === "dark";
      var label = dark
        ? (en ? "Switch to light mode" : "Passer en mode clair")
        : (en ? "Switch to dark mode" : "Passer en mode sombre");
      toggle.setAttribute("aria-label", label);
      toggle.title = label;
      if (text) {
        text.textContent = dark
          ? (en ? "Light mode" : "Mode clair")
          : (en ? "Dark mode" : "Mode sombre");
      }
    };

    toggle.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
      sync();
    });

    sync();
  }

  /* ---------- Menu mobile ---------- */
  var menuButton = document.querySelector(".nav__menu");
  var menu = document.getElementById("nav-actions");
  if (!menuButton || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  }

  menuButton.addEventListener("click", function (event) {
    event.stopPropagation();
    setOpen(!menu.classList.contains("is-open"));
  });

  // Un lien choisi ferme le menu ; le bouton de thème le laisse ouvert.
  menu.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setOpen(false);
      menuButton.focus();
    }
  });
})();
