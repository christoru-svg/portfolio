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

/* Avant / après : une galerie gallery--compare devient un curseur à faire glisser,
   une fois ses deux images chargées. Sans JavaScript, les deux écrans restent côte à côte. */

(function () {
  function loaded(img) {
    return new Promise(function (resolve, reject) {
      if (img.complete) return img.naturalWidth ? resolve() : reject();
      img.addEventListener("load", resolve);
      img.addEventListener("error", reject);
    });
  }

  function build(gallery, shots) {
    var stage = document.createElement("div");
    stage.className = "compare";
    gallery.insertBefore(stage, shots[0]);
    stage.append(shots[0], shots[1]);

    var range = document.createElement("input");
    range.type = "range";
    range.min = 0;
    range.max = 100;
    range.value = 50;
    range.className = "compare__range";
    range.setAttribute("aria-label", "Comparer l'avant et l'après");
    range.addEventListener("input", function () {
      stage.style.setProperty("--pos", range.value + "%");
    });

    var handle = document.createElement("div");
    handle.className = "compare__handle";
    handle.setAttribute("aria-hidden", "true");

    stage.append(range, handle);
    gallery.classList.add("is-slider");
  }

  document.querySelectorAll(".gallery--compare").forEach(function (gallery) {
    var shots = gallery.querySelectorAll(":scope > .shot");
    if (shots.length !== 2) return;
    var imgs = [shots[0].querySelector("img"), shots[1].querySelector("img")];
    if (!imgs[0] || !imgs[1]) return;
    imgs.forEach(function (img) { img.loading = "eager"; });
    Promise.all(imgs.map(loaded)).then(function () { build(gallery, shots); }, function () {});
  });
})();
