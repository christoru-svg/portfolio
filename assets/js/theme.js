/* Bouton clair / sombre du menu.
   Le thème de départ est posé par le petit script dans le <head> de chaque page
   (choix enregistré, sinon réglage du système). */
(function () {
  var root = document.documentElement;
  var button = document.querySelector(".theme-toggle");
  if (!button) return;
  var en = root.lang === "en";

  function sync() {
    var dark = root.dataset.theme === "dark";
    var label = dark
      ? (en ? "Switch to light mode" : "Passer en mode clair")
      : (en ? "Switch to dark mode" : "Passer en mode sombre");
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  button.addEventListener("click", function () {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    sync();
  });

  sync();
})();
