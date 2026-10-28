/* Galeries d'écrans des études de cas.
   Une image absente de assets/img/ est :
   - en local, remplacée par un emplacement en pointillés qui indique le fichier attendu ;
   - en ligne, masquée (et la galerie aussi si elle est vide), pour ne jamais publier d'emplacement vide. */

(function () {
  var isLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  function missing(img) {
    var shot = img.closest(".shot");
    var gallery = img.closest(".gallery");
    if (!shot || shot.dataset.missing) return;
    shot.dataset.missing = "true";

    if (isLocal) {
      var todo = document.createElement("div");
      todo.className = "shot__todo";
      todo.innerHTML = "<strong>Écran à ajouter</strong><span></span><code></code>";
      todo.querySelector("span").textContent = img.alt;
      todo.querySelector("code").textContent = img.getAttribute("src");
      img.replaceWith(todo);
      return;
    }

    shot.remove();
    if (gallery && !gallery.querySelector(".shot")) gallery.remove();
  }

  document.querySelectorAll(".shot img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) missing(img);
    else img.addEventListener("error", function () { missing(img); });
  });
})();
