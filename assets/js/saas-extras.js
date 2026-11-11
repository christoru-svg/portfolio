/* Touches personnelles de l'app SaaS, partagées par / (FR) et /en/ (EN) :
   panneau « confort de lecture », annotations façon Figma sur les écrans,
   chats cachés (La Gnometta, Paupiette, Madame) et note secrète.
   La page envoie deux événements : "saas:render" après chaque vue et
   "saas:lightbox" quand la visionneuse affiche une image. */
(function () {
  var EN = document.documentElement.lang === "en";
  var T = EN ? {
    comfort: "Reading comfort", intro: "Adjust the display to the way you read. Your choices are saved on this device.",
    font: ["Easy-to-read font", "Lexend, designed to make reading smoother"],
    large: ["Larger text", "+15% on the content"],
    contrast: ["Higher contrast", "Stronger secondary text and borders"],
    calm: ["Reduced motion", "No movement or transitions"],
    focus: ["Focus mode", "Hides navigation and secondary elements, designed with ADHD in mind"],
    reset: "Reset all", exitFocus: "Exit focus mode",
    annos: function (n) { return n + (n > 1 ? " notes" : " note"); }, showAnnos: "Notes",
    stamp: "Approved by La Gnometta",
    stampTip: "La Gnometta, 16, calico cat and chief UX tester at home, approves every project shipped to production.",
    hiding: "A cat is hiding here", found: function (name, n) { return "You found " + name + "! (" + n + "/3)"; }, again: function (name, n) { return name + " is already found (" + n + "/3)"; },
    explain: function (n) { return n === 3 ? "That's all three of my cats. A secret note is unlocking…" : "My three cats are hiding in this portfolio. Find all of them to unlock a secret note: " + (3 - n) + " left."; },
    hint: "Psst: they're hiding somewhere in the app.",
    secretTitle: "Secret note unlocked",
    secretBody: "La Gnometta (16), Paupiette (12) and Madame (4) are my three cats, the chief UX testers at home. You found all of them: curiosity is the first quality in user research. Since you made it this far, we should talk.",
    years: function (n) { return n + " years"; },
    call: "Book a call", close: "Close"
  } : {
    comfort: "Confort de lecture", intro: "Adaptez l'affichage à votre façon de lire. Vos choix sont gardés sur cet appareil.",
    font: ["Police facile à lire", "Lexend, conçue pour fluidifier la lecture"],
    large: ["Texte plus grand", "+15 % sur le contenu"],
    contrast: ["Contraste renforcé", "Textes secondaires et bordures plus marqués"],
    calm: ["Animations réduites", "Plus de mouvement ni de transition"],
    focus: ["Mode focus", "Masque la navigation et les éléments secondaires, pensé pour le TDAH"],
    reset: "Tout réinitialiser", exitFocus: "Quitter le mode focus",
    annos: function (n) { return n + (n > 1 ? " annotations" : " annotation"); }, showAnnos: "Annotations",
    stamp: "Validé par La Gnometta",
    stampTip: "La Gnometta, 16 ans, calico et testeuse UX en chef à la maison, valide chaque projet livré en production.",
    hiding: "Un chat se cache ici", found: function (name, n) { return "Tu as trouvé " + name + " ! (" + n + "/3)"; }, again: function (name, n) { return name + " est déjà trouvée (" + n + "/3)"; },
    explain: function (n) { return n === 3 ? "Ce sont mes trois chats, tu les as toutes. Une note secrète se débloque…" : "Mes trois chats se cachent dans ce portfolio. Trouve-les toutes pour débloquer une note secrète : encore " + (3 - n) + "."; },
    hint: "Psst : elles se cachent quelque part dans l'app.",
    secretTitle: "Note secrète débloquée",
    secretBody: "La Gnometta (16 ans), Paupiette (12 ans) et Madame (4 ans) sont mes trois chats, les testeuses UX en chef de la maison. Tu les as toutes retrouvées : la curiosité, c'est la première qualité en recherche utilisateur. Puisque tu es allé·e jusqu'ici, on devrait en parler.",
    years: function (n) { return n + " ans"; },
    call: "Discutons", close: "Fermer"
  };
  var root = document.documentElement;
  function store(key, val) { try { if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null"); localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; } }

  /* ---------- Confort de lecture ---------- */
  var KEYS = ["font", "large", "contrast", "calm", "focus"];
  var prefs = store("a11y") || {};
  var fontLoaded = false;
  function loadFont() {
    if (fontLoaded) return; fontLoaded = true;
    var l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }
  function applyPrefs() {
    KEYS.forEach(function (k) { root.classList.toggle("a11y-" + k, !!prefs[k]); });
    if (prefs.font) loadFont();
    store("a11y", prefs);
    document.querySelectorAll(".crow-sw").forEach(function (b) { b.setAttribute("aria-checked", String(!!prefs[b.dataset.k])); });
  }
  var cbtn = document.querySelector("[data-comfort]");
  var panel = document.createElement("div");
  panel.className = "cpanel"; panel.hidden = true; panel.id = "cpanel";
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", T.comfort);
  panel.innerHTML = "<h2>" + T.comfort + "</h2><p>" + T.intro + '</p><div class="crows">' +
    KEYS.map(function (k) { return '<button type="button" class="crow-sw" role="switch" aria-checked="false" data-k="' + k + '"><span><b>' + T[k][0] + "</b><small>" + T[k][1] + '</small></span><span class="sw" aria-hidden="true"></span></button>'; }).join("") +
    '</div><button type="button" class="creset">' + T.reset + "</button>";
  document.body.appendChild(panel);
  var exitBtn = document.createElement("button");
  exitBtn.type = "button"; exitBtn.className = "focus-exit";
  exitBtn.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>' + T.exitFocus;
  exitBtn.addEventListener("click", function () { prefs.focus = false; applyPrefs(); });
  document.body.appendChild(exitBtn);
  function openPanel() {
    panel.hidden = false; cbtn.setAttribute("aria-expanded", "true");
    var r = cbtn.getBoundingClientRect();
    panel.style.top = (r.bottom + 8) + "px";
    panel.style.left = Math.max(12, Math.min(r.right - 340, innerWidth - 352)) + "px";
    panel.querySelector(".crow-sw").focus();
  }
  function closePanel(refocus) { if (panel.hidden) return; panel.hidden = true; cbtn.setAttribute("aria-expanded", "false"); if (refocus) cbtn.focus(); }
  if (cbtn) {
    cbtn.setAttribute("aria-label", T.comfort); cbtn.title = T.comfort;
    cbtn.setAttribute("aria-controls", "cpanel"); cbtn.setAttribute("aria-expanded", "false");
    cbtn.addEventListener("click", function (e) { e.stopPropagation(); if (panel.hidden) openPanel(); else closePanel(true); });
  }
  panel.addEventListener("click", function (e) {
    e.stopPropagation();
    var sw = e.target.closest(".crow-sw");
    if (sw) { prefs[sw.dataset.k] = !prefs[sw.dataset.k]; applyPrefs(); return; }
    if (e.target.closest(".creset")) { prefs = {}; applyPrefs(); }
  });
  document.addEventListener("click", function () { closePanel(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { e.preventDefault(); closePanel(true); } });
  window.addEventListener("resize", function () { closePanel(false); });
  applyPrefs();

  /* ---------- Chats ---------- */
  function catSvg(kind) {
    var body = "M7 21c-1.2-1.6-1.6-3.6-1.2-5.6.3-1.6 1.2-3 2.4-4L7.4 5.6c-.1-.5.5-.9.9-.5l2.6 2.6c.7-.2 1.4-.3 2.1-.3s1.4.1 2.1.3l2.6-2.6c.4-.4 1 0 .9.5l-.8 5.8c1.2 1 2.1 2.4 2.4 4 .4 2-.1 4-1.2 5.6z";
    if (kind === "calico") {
      return '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="' + body + '" fill="#f6f1e8" stroke="#3a2f2a" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<path d="M8.3 5.9l2.6 2.6c-1.4.5-2.6 1.4-3.3 2.6z" fill="#e0893b"/><path d="M17.7 5.9l-2.6 2.6c1.5.5 2.6 1.3 3.3 2.5z" fill="#2c2420"/>' +
        '<path d="M13 15.5c2.4.2 4.6 1.6 5.3 3.8.2.6.1 1.2-.1 1.7H13z" fill="#e0893b"/><path d="M6.8 17.2c.9-.6 2.2-.7 3.1.1.6.6.6 1.6.2 2.5L9 21H7c-.6-1.2-.7-2.6-.2-3.8z" fill="#2c2420"/>' +
        '<circle cx="10.6" cy="13.2" r=".9" fill="#3a2f2a"/><circle cx="15.4" cy="13.2" r=".9" fill="#3a2f2a"/><path d="M12.3 15.2h1.4L13 16z" fill="#c9776f"/></svg>';
    }
    var face = '<circle cx="10.6" cy="13.2" r=".9" fill="#3a2f2a"/><circle cx="15.4" cy="13.2" r=".9" fill="#3a2f2a"/><path d="M12.3 15.2h1.4L13 16z" fill="#c9776f"/>';
    if (kind === "white") {
      return '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="' + body + '" fill="#fcfbf8" stroke="#3a2f2a" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<path d="M8.6 7l1.6 1.6c-.6.3-1.1.6-1.5 1z" fill="#efc2bd"/><path d="M17.4 7l-1.6 1.6c.6.3 1.1.6 1.5 1z" fill="#efc2bd"/>' + face + '</svg>';
    }
    if (kind === "grey") {
      return '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="' + body + '" fill="#8e9097" stroke="#2f3136" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<ellipse cx="13" cy="15.7" rx="2.3" ry="1.6" fill="#f6f5f2"/><ellipse cx="9.6" cy="20.4" rx="1.7" ry=".9" fill="#f6f5f2"/><ellipse cx="16.4" cy="20.4" rx="1.7" ry=".9" fill="#f6f5f2"/>' +
        face + '</svg>';
    }
    return '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="' + body + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="10.6" cy="13.2" r=".9" fill="currentColor"/><circle cx="15.4" cy="13.2" r=".9" fill="currentColor"/><path d="M12.3 15.2h1.4L13 16z" fill="currentColor"/></svg>';
  }
  var CATS = [
    { id: "gnometta", name: "La Gnometta", kind: "calico", view: "accueil", where: ".refs" },
    { id: "paupiette", name: "Paupiette", kind: "grey", view: "notes", where: ".j-head" },
    { id: "madame", name: "Madame", kind: "white", view: "projets", where: ".tools" }
  ];
  var found = store("cats-found") || [];
  function toast(html, ms) {
    var old = document.querySelector(".toast"); if (old) old.remove();
    var t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.innerHTML = html;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, ms || 2600);
  }
  var secret = document.createElement("div");
  secret.className = "secret"; secret.hidden = true; secret.setAttribute("role", "dialog"); secret.setAttribute("aria-modal", "true"); secret.setAttribute("aria-labelledby", "secret-title");
  secret.innerHTML = '<div class="secret-card"><div class="secret-cats">' + [["calico", "La Gnometta", 16], ["grey", "Paupiette", 12], ["white", "Madame", 4]].map(function (c) { return "<figure>" + catSvg(c[0]) + "<figcaption><b>" + c[1] + "</b>" + T.years(c[2]) + "</figcaption></figure>"; }).join("") + "</div>" +
    '<h2 id="secret-title">' + T.secretTitle + "</h2><p>" + T.secretBody + '</p><div class="secret-actions"><button type="button" class="btn primary" data-secret="call">' + T.call + '</button><button type="button" class="btn" data-secret="close">' + T.close + "</button></div></div>";
  document.body.appendChild(secret);
  function closeSecret() { secret.hidden = true; }
  secret.addEventListener("click", function (e) {
    var a = e.target.closest("[data-secret]");
    if (e.target === secret || (a && a.dataset.secret === "close")) closeSecret();
    if (a && a.dataset.secret === "call") { closeSecret(); location.hash = "contact"; }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !secret.hidden) closeSecret(); });
  function onCat(cat, btn) {
    var already = found.indexOf(cat.id) > -1;
    if (!already) { found.push(cat.id); store("cats-found", found); }
    btn.classList.add("found");
    toast(catSvg(cat.kind) + "<span><b>" + (already ? T.again(cat.name, found.length) : T.found(cat.name, found.length)) + "</b><small>" + T.explain(found.length) + "</small></span>", 6000);
    if (found.length === 3) setTimeout(function () { secret.hidden = false; secret.querySelector("[data-secret=call]").focus(); }, 700);
  }
  function placeCats(view) {
    CATS.forEach(function (cat) {
      if (cat.view !== view) return;
      var host = document.querySelector("#main " + cat.where);
      if (!host || host.querySelector(".cat-hide")) return;
      var b = document.createElement("button");
      b.type = "button"; b.className = "cat-hide" + (found.indexOf(cat.id) > -1 ? " found" : "");
      b.setAttribute("aria-label", T.hiding); b.innerHTML = catSvg(cat.kind);
      b.addEventListener("click", function (e) { e.stopPropagation(); onCat(cat, b); });
      host.appendChild(b);
    });
  }

  /* ---------- Annotations ---------- */
  var ANNOS = {
    "oodrive-sign-accueil-apres": [
      [14, 41, "Le parcours 1 clic passe en premier : il couvre 85 % des usages.", "The 1-click journey comes first: it covers 85% of use cases."],
      [24, 21, "Une phrase de bienvenue et le périmètre bien visible : on sait tout de suite pour quelle équipe on signe.", "A welcome line and a visible scope: you know right away which team you're signing for."],
      [88, 37, "Des widgets raccourcis vers les signataires et les documents en cours, pour gagner du temps.", "Shortcut widgets to signers and ongoing documents, to save time."]
    ],
    "oodrive-sign-signature-groupee": [
      [42, 51, "Le signataire voit tout de suite les autres documents qui l'attendent.", "The signer immediately sees the other documents waiting for them."],
      [93, 96, "Un seul geste pour tout signer en une fois.", "One action to sign everything at once."]
    ],
    "workout-log-seance": [
      [50, 32, "+2,5 kg n'est proposé qu'après deux séances faciles et des lendemains calmes.", "+2.5 kg is only suggested after two easy sessions and calm next days."],
      [42, 44, "La dernière performance s'affiche : plus besoin de s'en souvenir.", "The last performance is shown: no need to remember it."],
      [18, 95, "« Ça tire » marque une gêne sur une série, sans quitter l'exercice.", "“Ça tire” (it pulls) flags discomfort on a set without leaving the exercise."],
      [68, 95, "Un seul gros bouton, utilisable téléphone posé sur un banc.", "One big button, usable with the phone resting on a bench."]
    ],
    "pense-frigo-stock-v3": [
      [44, 17, "Un ton rassurant : l'appli dit ce qui presse, ou que rien ne presse.", "A reassuring tone: the app says what's urgent, or that nothing is."],
      [50, 33, "Le prochain produit à surveiller reste visible, même quand tout va bien.", "The next product to watch stays visible, even when everything is fine."]
    ],
    "pense-frigo-ajouter": [
      [56, 46, "La photo du frigo et le scan du ticket passent en premier : ce sont les saisies en un geste.", "The fridge photo and receipt scan come first: they're the one-gesture inputs."],
      [56, 92, "La saisie à la main arrive en dernier : c'est elle qui fait abandonner les applis d'inventaire.", "Manual entry comes last: it's what makes people give up on inventory apps."]
    ],
    "pense-frigo-scan": [
      [62, 30, "Les dates sont présentées comme des estimations : l'IA propose, l'utilisateur garde la main.", "Dates are shown as estimates: AI suggests, the user stays in control."],
      [12, 63, "Rien n'est ajouté sans vérification : les libellés de ticket sont abrégés et changent selon les enseignes.", "Nothing is added without review: receipt labels are abbreviated and vary by store."],
      [40, 77, "Le libellé brut du ticket reste visible sous le produit reconnu.", "The raw receipt label stays visible under the recognized product."]
    ]
  };
  var annosOn = store("annos-on"); if (annosOn === null) annosOn = true;
  var AV = "/assets/img/saas/portrait-face.jpg";
  function nameOf(src) { var m = /\/([^\/]+)\.jpg/.exec(src || ""); return m ? m[1] : ""; }
  function badgeShots() {
    document.querySelectorAll("#main .shot img").forEach(function (img) {
      var list = ANNOS[nameOf(img.getAttribute("src"))];
      var im = img.parentNode;
      if (!list || im.querySelector(".anno-badge")) return;
      var b = document.createElement("span"); b.className = "anno-badge";
      b.innerHTML = "<i>" + list.length + "</i>" + T.annos(list.length);
      im.appendChild(b);
    });
  }
  var lbImg = document.getElementById("lbimg");
  var layer = null, toggle = null;
  function ensureLayer() {
    if (layer || !lbImg) return;
    layer = document.createElement("div"); layer.className = "pins";
    lbImg.parentNode.appendChild(layer);
    toggle = document.createElement("button"); toggle.type = "button"; toggle.className = "lb-anno";
    toggle.addEventListener("click", function () { annosOn = !annosOn; store("annos-on", annosOn); renderPins(); });
    var top = document.querySelector(".lb-top");
    if (top) top.insertBefore(toggle, top.lastElementChild);
  }
  function fitLayer() {
    if (!layer) return;
    layer.style.left = lbImg.offsetLeft + "px"; layer.style.top = lbImg.offsetTop + "px";
    layer.style.width = lbImg.offsetWidth + "px"; layer.style.height = lbImg.offsetHeight + "px";
  }
  function renderPins() {
    ensureLayer(); if (!layer) return;
    var list = ANNOS[nameOf(lbImg.getAttribute("src"))];
    toggle.hidden = !list;
    if (list) { toggle.innerHTML = '<span class="anno-badge" style="position:static;padding:0;border:0;background:none"><i>' + list.length + "</i></span>" + T.showAnnos; toggle.setAttribute("aria-pressed", String(annosOn)); }
    layer.hidden = !list || !annosOn;
    layer.innerHTML = "";
    if (!list) return;
    list.forEach(function (a, i) {
      var pin = document.createElement("button");
      pin.type = "button"; pin.className = "pin"; pin.textContent = i + 1;
      pin.style.left = a[0] + "%"; pin.style.top = a[1] + "%";
      pin.setAttribute("aria-expanded", "false"); pin.setAttribute("aria-label", T.showAnnos + " " + (i + 1));
      var bub = document.createElement("div"); bub.className = "bubble"; bub.hidden = true;
      bub.innerHTML = '<header><img src="' + AV + '" alt=""><b>Christopher</b><span>#' + (i + 1) + "</span></header><p>" + (EN ? a[3] : a[2]) + "</p>";
      bub.style.left = Math.min(a[0], 62) + "%";
      if (a[1] > 60) bub.style.bottom = (100 - a[1] + 4) + "%"; else bub.style.top = (a[1] + 2) + "%";
      pin.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = bub.hidden;
        layer.querySelectorAll(".bubble").forEach(function (x) { x.hidden = true; });
        layer.querySelectorAll(".pin").forEach(function (x) { x.setAttribute("aria-expanded", "false"); });
        bub.hidden = !open; pin.setAttribute("aria-expanded", String(open));
      });
      bub.addEventListener("click", function (e) { e.stopPropagation(); });
      layer.appendChild(pin); layer.appendChild(bub);
    });
    fitLayer();
  }
  if (lbImg) {
    lbImg.addEventListener("load", fitLayer);
    window.addEventListener("resize", fitLayer);
  }
  document.addEventListener("saas:lightbox", function () { renderPins(); requestAnimationFrame(fitLayer); });

  /* ---------- Après chaque rendu de vue ---------- */
  function onRender(e) {
    var d = e.detail || {};
    var empty = document.querySelector("#main .empty");
    if (empty && !empty.querySelector(".cat-empty")) empty.insertAdjacentHTML("afterbegin", catSvg("calico").replace("<svg ", '<svg class="cat-empty" '));
    placeCats(d.view);
    badgeShots();
    if (d.view === "detail") {
      var chip = document.querySelector("#main .dtitle .chip.ok");
      if (chip && !chip.parentNode.querySelector(".stamp")) {
        var s = document.createElement("button"); s.type = "button"; s.className = "stamp"; s.setAttribute("aria-expanded", "false");
        s.innerHTML = catSvg("calico") + T.stamp + '<span class="tip" role="tooltip" id="stamp-tip">' + T.stampTip + "</span>";
        s.setAttribute("aria-describedby", "stamp-tip");
        s.addEventListener("click", function (ev) { ev.stopPropagation(); s.setAttribute("aria-expanded", String(s.getAttribute("aria-expanded") !== "true")); });
        chip.insertAdjacentElement("afterend", s);
      }
    }
    if (d.view === "apropos") {
      var cats = document.querySelector("#main .pas-links.cats");
      if (cats && !cats.parentNode.querySelector(".cat-hint")) {
        var h = document.createElement("span"); h.className = "cat-hint"; h.textContent = T.hint;
        cats.parentNode.appendChild(h);
      }
    }
  }
  document.addEventListener("click", function () { document.querySelectorAll(".stamp[aria-expanded=true]").forEach(function (x) { x.setAttribute("aria-expanded", "false"); }); });

  /* ---------- Balade : un chat passe de temps en temps sur les cartes projet ---------- */
  var walkTimer = null, walking = false;
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)");
  function calmNow() { return RM.matches || root.classList.contains("a11y-calm") || root.classList.contains("a11y-focus") || document.hidden; }
  function visibleCards() {
    var view = document.getElementById("main").getBoundingClientRect();
    return [].slice.call(document.querySelectorAll("#main .grid .card")).filter(function (c) {
      var r = c.getBoundingClientRect();
      return r.top > view.top + 30 && r.bottom < view.bottom && r.width > 0;
    });
  }
  function walk() {
    if (walking || calmNow()) return schedule(20000);
    var cards = visibleCards();
    if (!cards.length) return schedule(12000);
    var card = cards[Math.floor(Math.random() * cards.length)];
    var grid = card.parentNode;
    var kinds = ["calico", "grey", "white"], kind = kinds[Math.floor(Math.random() * 3)];
    walking = true;
    grid.classList.add("has-walker");
    var cat = document.createElement("span");
    cat.className = "walker"; cat.setAttribute("aria-hidden", "true"); cat.innerHTML = catSvg(kind);
    var y = card.offsetTop - 30, x0 = card.offsetLeft - 10, xMid = card.offsetLeft + card.offsetWidth * 0.42, x1 = card.offsetLeft + card.offsetWidth - 26;
    cat.style.top = y + "px"; cat.style.left = "0px";
    grid.appendChild(cat);
    function frames(a, b, steps) {
      var f = [];
      for (var i = 0; i <= steps; i++) { var t = i / steps; f.push({ transform: "translate(" + (a + (b - a) * t) + "px," + (i % 2 ? -3 : 0) + "px)" }); }
      return f;
    }
    var inA = cat.animate([{ transform: "translate(" + x0 + "px, 18px)", opacity: 0 }, { transform: "translate(" + x0 + "px, 0)", opacity: 1 }], { duration: 350, fill: "forwards", easing: "ease-out" });
    inA.onfinish = function () {
      var w1 = cat.animate(frames(x0, xMid, 8), { duration: 1500, fill: "forwards", easing: "linear" });
      w1.onfinish = function () {
        cat.animate([{ transform: "translate(" + xMid + "px,0)" }, { transform: "translate(" + xMid + "px,-10px) rotate(-12deg)" }, { transform: "translate(" + xMid + "px,0)" }], { duration: 420, fill: "forwards", easing: "ease-out" });
        card.animate([{ transform: "none" }, { transform: "rotate(-2.2deg) translate(4px,2px)" }, { transform: "rotate(1.2deg) translate(-2px,0)" }, { transform: "rotate(-.6deg)" }, { transform: "none" }], { duration: 750, delay: 220, easing: "ease-out" });
        setTimeout(function () {
          var w2 = cat.animate(frames(xMid, x1, 7), { duration: 1300, fill: "forwards", easing: "linear" });
          w2.onfinish = function () {
            var out = cat.animate([{ transform: "translate(" + x1 + "px,0)", opacity: 1 }, { transform: "translate(" + x1 + "px,18px)", opacity: 0 }], { duration: 350, fill: "forwards", easing: "ease-in" });
            out.onfinish = function () { cat.remove(); grid.classList.remove("has-walker"); walking = false; schedule(); };
          };
        }, 900);
      };
    };
  }
  function schedule(ms) { clearTimeout(walkTimer); walkTimer = setTimeout(walk, ms || 25000 + Math.random() * 15000); }
  document.addEventListener("saas:render", function (e) {
    var v = (e.detail || {}).view;
    clearTimeout(walkTimer);
    if (v === "projets" || v === "labo" || v === "accueil") schedule(5000 + Math.random() * 3000);
  });
  if (window.saasState && ["projets", "labo", "accueil"].indexOf(window.saasState.view) > -1) schedule(6000);
  document.addEventListener("saas:render", onRender);
  if (window.saasState) onRender({ detail: window.saasState });
})();
