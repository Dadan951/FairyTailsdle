# FairyTailsdle

Jeu quotidien type Wordle/Loldle basé sur l'univers **Fairy Tail**. Le joueur doit deviner le personnage du jour ; chaque tentative révèle des attributs (genre, race, magie, affiliation...) comparés à la bonne réponse.

Objectif : proposer une meilleure exécution que les sites existants (ex. Mangadle.net), pas forcément une première mondiale sur l'univers.

## Cahier des charges

### Constat marché
- La quasi-totalité des univers manga/anime populaires ont déjà un "-dle" (Naruto, One Piece, MHA, JJK, Chainsaw Man, Fairy Tail...), souvent via des hubs génériques (Mangadle.net, Chardle.com, Animedle.org).
- Le Fairy Tail dle existant (Mangadle.net) n'a qu'un seul mode (Classic), ~122 personnages, un design template générique, et pas de fonctionnalités sociales au-delà d'un streak en local storage.
- **Angle choisi : faire mieux** (design/UX, plus de modes, data plus riche, progression locale plus poussée) plutôt que viser un univers vierge.

### Écran d'accueil
Page `/` avec sélection du mode (cartes à la Narutodle), chaque mode ayant sa propre route :
- [x] **Classic** (`/classic`) — tableau d'attributs, avec indices intégrés (guilde, cheveux, genre) débloqués tous les 3 essais ratés
- [x] **Image** (`/image`) — image du personnage pixelisée, qui se dépixelise progressivement à chaque essai raté (netteté complète après 8 essais), révélée en clair à la victoire
- [ ] Citation (deviner via une réplique célèbre)
- [ ] Emoji (deviner via une suite d'emojis représentant le perso)

Les deux modes actifs partagent le même personnage du jour (calculé par date) — seule la façon de le deviner change.

### Progression / social
- Pas de compte utilisateur, pas de backend.
- Streak/historique calculés et stockés en local (localStorage) — pas affichés dans l'UI pour l'instant (retiré pour épurer la page principale).
- Partage de résultat façon Wordle : une case emoji par essai (🟩 bonne réponse, 🟨 proche, 🟥 loin) avec légende, copiable dans le presse-papier — pas une grille par attribut (illisible à plus de quelques essais).
- Bouton "Rejouer" après une victoire/défaite : relance une partie bonus avec un personnage aléatoire, sans toucher à la sauvegarde ni aux stats du défi du jour (un seul défi officiel compte par jour).

### Stack technique
- **Next.js** (React, TypeScript, App Router, Tailwind CSS, ESLint) — pas de backend, pas de compte.
- Déploiement sur **Vercel**.
- Internationalisation FR/EN maison (`src/lib/i18n.ts` + `LanguageContext`) : sélecteur en haut à droite, préférence sauvegardée en localStorage. Traduit les textes de l'interface et les valeurs d'attributs (genre, race, couleurs, magie, statut, arcs/sagas...). Les noms des personnages ne sont **pas** traduits (identiques dans le doublage français officiel).

### Données des personnages
- Format : JSON local (un fichier par personnage ou un fichier unique liste).
- Attributs affichés en mode Classic (9, tenant sur une seule ligne sans défilement, tableau
  élargi à `max-w-6xl`) : Genre, Couleur cheveux, Attribut magique, Arme, Occupation, Guilde,
  Statut, Premier arc, Saga. Race, Couleur yeux et Type de magie (Caster/Holder) existent dans
  les données mais ne sont plus affichés (retirés pour que le tableau tienne sur une ligne).
- Source : wiki Fairy Tail (fandom.com), infos et images récupérées via l'API MediaWiki (hotlink direct).
- Droits d'image : images fan-content non-officielles. **Décision : le site restera toujours gratuit, en accès libre, sans compte ni monétisation** — usage non-commercial confirmé durablement, pas seulement le temps du développement.
- Fond de page : wallpaper fan-art "Wallpaper by Inusuki | Fairy Tail © Hiro Mashima" (`public/background.jpg`). Crédit non affiché sur le site (retiré à la demande) mais documenté ici.

### Hébergement
- Vercel (cohérent avec le choix Next.js).

## Statut
En-tête épuré (`Navbar.tsx`, sticky) : juste un menu hamburger, le logo et le sélecteur FR/EN.
Le menu ouvre un panneau latéral (sidebar) depuis la gauche avec les liens Accueil/Classic/Image.
Pied de page (`Footer.tsx`) avec une courte explication du site et le crédit du créateur, sans
mention de la stack technique. Écran d'accueil avec 2 modes jouables (Classic, Image pixelisée),
FR/EN, responsive mobile — Citation/Emoji à venir.
La recherche de personnage (autocomplete) affiche une miniature à côté de chaque nom.

Le tableau d'attributs (Classic) est responsive et **sans aucune barre de défilement** :
- Desktop/tablette (`sm:` et plus) : vraie ligne de tableau, `table-fixed`, le texte long
  (ex. "Arc de la Bataille de Fairy Tail") se replie sur plusieurs lignes dans sa cellule au
  lieu de forcer la largeur du tableau.
- Mobile (< `sm`) : cartes par tentative avec grille 3 colonnes, plus lisible qu'un tableau
  compressé à 10 colonnes sur un petit écran.

Avatar du personnage agrandi dans le tableau (48px desktop / 44px mobile, avec liseré).
Le mode "Partie bonus" (après Rejouer) a un vrai badge visuel (`PracticeBadge.tsx`, pilule
dégradée doré/orange avec icône 🎲) au lieu d'un simple texte.

### Note technique — mode Image
La pixelisation est faite par canvas : l'image source est redessinée en très basse résolution
(quelques blocs) puis remise à l'échelle sans lissage (`imageSmoothingEnabled = false`), ce qui
donne l'effet "gros pixels". Le nombre de blocs augmente avec le nombre d'essais ratés, donc
l'image devient de plus en plus nette (voir `PixelatedImage.tsx`).

⚠️ Vérifié explicitement (pas de bug) : le personnage reste le même du début à la fin d'une
manche — seule sa netteté change. Le niveau de départ (`MIN_BLOCKS`) était fixé à 4, tellement
extrême que l'image ressemblait à des taches de couleur aléatoires, donnant l'impression trompeuse
que le personnage changeait une fois l'image plus nette. Remonté à 10 pour rester un vrai défi
tout en laissant deviner une silhouette dès le départ.

---

## Développement

Projet Next.js standard (créé avec `create-next-app`).

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Déployé automatiquement sur Vercel à chaque push sur `main`.
