# Portfolio — Christopher De Paola

Site statique en HTML/CSS, sans dépendance ni étape de build. Hébergé sur Vercel.

## Structure

```
index.html                        Page d'accueil
projet-refonte-oodrive-sign/      Étude de cas Oodrive Sign
dotation-gift/                    Étude de cas Swile Gift
projet-myoodrivesign/             Étude de cas myOodriveSign
projet-skill-audit/               Étude de cas skill Claude
projet-design-system/             Étude de cas refonte du design system
projet-lexis-nexis/               Étude de cas Lexis 360
en/                               Version anglaise (même structure : en/index.html, en/projet-…/)
assets/css/style.css              Styles (couleurs et polices en haut du fichier)
assets/js/home.js                 Animations de l'accueil (titres, étapes de la méthode, barres IA)
assets/js/gallery.js              Galeries d'écrans et prototypes des études de cas
assets/img/                       Images
assets/cv-christopher-de-paola.pdf  CV téléchargeable (accueil, section Contact et pied de page)
```

## Modifier le site

- **Un texte** : ouvre le fichier `index.html` de la page concernée et modifie le texte entre les balises.
- **Une image** : remplace le fichier dans `assets/img/` en gardant le même nom.
- **Une couleur ou une police** : modifie les variables dans `:root`, en haut de `assets/css/style.css`.

Sur GitHub, tu peux modifier un fichier directement dans le navigateur (icône crayon). Vercel redéploie automatiquement à chaque modification.

## Ajouter des écrans

Chaque étude de cas contient des galeries d'écrans (`<div class="gallery">`). Chaque emplacement attend une image dans `assets/img/`, avec un nom précis.

- **En local**, un emplacement sans image s'affiche en pointillés avec le nom du fichier attendu.
- **En ligne**, un emplacement sans image est masqué. Tu peux donc publier le site même si tous les écrans ne sont pas encore là.

Pour remplir un emplacement, exporte l'écran depuis Figma (PNG en 2x) et dépose-le dans `assets/img/` sous le nom indiqué. Pense à relire la légende (`figcaption`) et à anonymiser les noms et emails clients.

Variantes de galerie : `gallery--2` et `gallery--3` (colonnes), `gallery--phones` (écrans mobiles), `gallery--wide` (plus large que le texte), `gallery--compare` (avant / après : devient un curseur à faire glisser, avec les deux écrans côte à côte si JavaScript est désactivé). Un `data-label="Avant"` ou `data-label="Après"` sur une `figure` ajoute une étiquette.

## Version anglaise

Chaque page française a son équivalent dans `en/`, au même chemin. Le bouton EN / FR de la navigation passe de l'une à l'autre. Quand tu modifies un texte en français, pense à reporter la modification dans la page anglaise.

Pour remplacer le CV, dépose le nouveau PDF sous le même nom : `assets/cv-christopher-de-paola.pdf`.

## Animations de l'accueil

Elles sont gérées par `assets/js/home.js` et la partie « Animations de l'accueil » de `style.css`. Si un visiteur a activé « réduire les animations » sur son appareil, elles sont désactivées et la page s'affiche normalement.

## Voir le site en local

```bash
python3 -m http.server 8420
```

Puis ouvre http://localhost:8420.

## À compléter

Les endroits marqués `À ajouter` dans le code :

- `projet-lexis-nexis/index.html` : le lien vers le prototype Figma
- `projet-myoodrivesign/index.html` : des données d'usage depuis le lancement
- `projet-skill-audit/index.html` : le nombre de designers qui ont réutilisé la skill
- `projet-design-system/index.html` : le taux d'adoption et le gain de time-to-market mesuré, et le paragraphe « Ce que je ferais différemment » à reformuler avec tes mots

Les mêmes commentaires sont présents dans les pages de `en/`.
