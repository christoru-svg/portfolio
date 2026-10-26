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

## Voir le site en local

```bash
python3 -m http.server 8420
```

Puis ouvre http://localhost:8420.

## À compléter

Les endroits marqués `À ajouter` dans le code :

- `index.html` : ton adresse email dans le footer
- `projet-lexis-nexis/index.html` : le lien vers le prototype Figma
- `projet-myoodrivesign/index.html` : des données d'usage depuis le lancement
- `projet-skill-audit/index.html` : le temps gagné grâce à la skill
