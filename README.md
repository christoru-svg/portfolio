# Portfolio — Christopher De Paola

Site statique en HTML/CSS, sans dépendance ni étape de build. Hébergé sur Vercel.

## Structure

```
index.html                        Page d'accueil
projet-refonte-oodrive-sign/      Étude de cas Oodrive Sign
dotation-gift/                    Étude de cas Swile Gift
projet-myoodrivesign/             Étude de cas myOodriveSign
projet-skill-audit/               Étude de cas skill Claude
projet-lexis-nexis/               Étude de cas Lexis 360
assets/css/style.css              Styles (couleurs et polices en haut du fichier)
assets/img/                       Images
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

Variantes de galerie : `gallery--2` et `gallery--3` (colonnes), `gallery--phones` (écrans mobiles), `gallery--wide` (plus large que le texte), `gallery--compare` (même cadrage pour un avant / après). Un `data-label="Avant"` ou `data-label="Après"` sur une `figure` ajoute une étiquette.

## Voir le site en local

```bash
python3 -m http.server 8420
```

Puis ouvre http://localhost:8420.

## À compléter

Les endroits marqués `À ajouter` dans le code :

- `projet-lexis-nexis/index.html` : le lien vers le prototype Figma
- `projet-myoodrivesign/index.html` : des données d'usage depuis le lancement
- `projet-skill-audit/index.html` : le temps gagné grâce à la skill
