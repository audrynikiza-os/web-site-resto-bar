# Umuco Resto-Bar — Site web

Site officiel du **Umuco Resto-Bar** (Kigarama-Mwaro, Burundi) : menu et prix, soirées karaoké, activités (chevaux, zipline, piscine), galerie photos, contact et réservation via WhatsApp.

## Ouvrir le site

Double-cliquez simplement sur `index.html` (aucune installation nécessaire).
Pour le publier : déposez tout le dossier sur Netlify, GitHub Pages, Vercel ou n'importe quel hébergeur.

## Structure

```
projet web/
├── index.html              → La page du site
├── css/style.css           → Les styles (couleurs, mise en page)
├── js/i18n.js              → Textes en français et en anglais
├── js/main.js              → Fonctionnement du site (menu, galerie, formulaire)
├── data/menu.js            → Boissons, nourriture et PRIX
├── data/infos.js           → Téléphone, WhatsApp, carte, activités
└── assets/images/          → Logo, fond d'accueil et photos de la galerie
```

## Modifier les prix ou le menu

Ouvrez `data/menu.js` et changez simplement les chiffres :

```js
{ name_fr: "Primus Star", name_en: "Primus Star", price: 6000 },
```

- `price` : le prix en FBu (sans espace ni "FBu", juste le nombre).
- Les boissons sont dans `drinks`, la nourriture dans `food`.

## Modifier le téléphone / WhatsApp / la carte

Ouvrez `data/infos.js` :

- `phoneDisplay` : le numéro affiché sur le site.
- `whatsapp` : le numéro format international sans `+` ni espaces (ex. `25771040055`).
- `mapEmbed` : l'adresse de la carte Google Maps (remplacez la recherche par l'adresse exacte).

## Ajouter vos vraies photos

1. Copiez vos photos dans `assets/images/` (ex. `gal-1.jpg`, `gal-2.jpg`…).
2. Dans `index.html`, section **Galerie** : remplacez `assets/images/gal-1.svg` par `assets/images/gal-1.jpg`, etc.
3. Pour les activités : modifiez les chemins `img` dans `data/infos.js`.

## Modifier les textes (français / anglais)

Tous les textes sont dans `js/i18n.js`, organisés par section (`hero`, `about`, `menu`, `karaoke`…).
Le site est bilingue : le bouton **EN / FR** dans la barre de navigation change la langue (choix mémorisé dans le navigateur).

## Infos actuelles du site

- **Adresse** : Kigarama-Mwaro, Burundi
- **Téléphone / WhatsApp** : +257 71 04 00 55
- **Horaires** : resto-bar ouvert 24h/24 · karaoké vendredi & samedi, 19h00 – 00h00
- **Activités** : cheval 50 000 FBu · zipline 50 000 FBu · piscine gratuite avec consommation
