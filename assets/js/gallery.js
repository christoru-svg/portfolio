/* Galeries d'écrans des études de cas.
   Une image absente de assets/img/ est :
   - en local, remplacée par un emplacement en pointillés qui indique le fichier attendu ;
   - en ligne, masquée (et la galerie aussi si elle est vide), pour ne jamais publier d'emplacement vide. */

(function () {
  var en = document.documentElement.lang === "en";
  var isLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  function missing(img) {
    var shot = img.closest(".shot");
    var gallery = img.closest(".gallery");
    if (!shot || shot.dataset.missing) return;
    shot.dataset.missing = "true";

    if (isLocal) {
      var todo = document.createElement("div");
      todo.className = "shot__todo";
      todo.innerHTML = "<strong>" + (en ? "Screen to add" : "Écran à ajouter") + "</strong><span></span><code></code>";
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
  var en = document.documentElement.lang === "en";
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
    range.setAttribute("aria-label", en ? "Compare before and after" : "Comparer l'avant et l'après");
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

/* Prototypes : chaque .proto__step est un écran ; sa zone .proto__hotspot mène à l'écran
   suivant (data-go="end" affiche la fin du parcours, data-go="1" revient au premier écran). */

(function () {
  document.querySelectorAll(".proto").forEach(function (proto) {
    var steps = proto.querySelectorAll(".proto__step");
    var caption = proto.querySelector(".proto__caption");
    var current = 0;

    function show(i) {
      current = i;
      proto.classList.remove("is-ended");
      steps.forEach(function (step, n) {
        step.classList.toggle("is-active", n === i);
        step.inert = n !== i;
      });
      caption.innerHTML = "<strong>" + (i + 1) + " / " + steps.length + "</strong>";
      caption.append(" " + steps[i].dataset.caption);
    }

    function end() {
      proto.classList.add("is-ended");
      steps[current].inert = true;
      caption.innerHTML = "";
      caption.append(proto.dataset.endCaption || "");
      proto.querySelector(".proto__end .proto__restart").focus();
    }

    proto.addEventListener("click", function (e) {
      var hotspot = e.target.closest(".proto__hotspot");
      if (hotspot) {
        var go = hotspot.dataset.go;
        if (go === "end") end();
        else show(go ? Number(go) - 1 : current + 1);
        var next = proto.querySelector(".proto__step.is-active .proto__hotspot");
        if (next && go !== "end" && e.detail === 0) next.focus();
      }
      if (e.target.closest(".proto__restart")) show(0);
    });

    show(0);
  });
})();

/* Zoom : un clic (ou Entrée) sur un écran l'ouvre en grand. Un clic sur l'image agrandie
   l'affiche à sa taille réelle ; Échap, le bouton × ou un clic à côté referment. */

(function () {
  var en = document.documentElement.lang === "en";
  var selector = ".shot img, .figure img";
  var dialog, view, caption;

  function setup() {
    dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", en ? "Enlarged image" : "Image agrandie");
    dialog.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="' + (en ? "Close" : "Fermer") + '">×</button>' +
      '<div class="lightbox__inner"><img alt=""><p class="lightbox__caption"></p></div>';
    view = dialog.querySelector("img");
    caption = dialog.querySelector(".lightbox__caption");

    dialog.querySelector(".lightbox__close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) {
      if (e.target === view) dialog.classList.toggle("is-full");
      else if (!e.target.closest(".lightbox__caption")) dialog.close();
    });
    dialog.addEventListener("close", function () { dialog.classList.remove("is-full"); });
    document.body.append(dialog);
  }

  function open(img) {
    if (!dialog) setup();
    var figure = img.closest("figure");
    var text = figure && figure.querySelector("figcaption");
    view.src = img.currentSrc || img.src;
    view.alt = img.alt;
    caption.textContent = text ? text.textContent : img.alt;
    dialog.showModal();
  }

  function zoomable(img) {
    return !img.closest(".compare, .gallery--compare") && !img.closest(".shot[data-missing]");
  }

  document.querySelectorAll(selector).forEach(function (img) {
    if (!zoomable(img)) return;
    img.classList.add("zoomable");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", (en ? "Enlarge: " : "Agrandir : ") + img.alt);
  });

  document.addEventListener("click", function (e) {
    var img = e.target.closest(selector);
    if (img && img.classList.contains("zoomable")) open(img);
  });
  document.addEventListener("keydown", function (e) {
    var img = e.target;
    if ((e.key === "Enter" || e.key === " ") && img.classList && img.classList.contains("zoomable")) {
      e.preventDefault();
      open(img);
    }
  });
})();
