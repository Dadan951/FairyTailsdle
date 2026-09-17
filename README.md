# FairyTailsdle

Jeu quotidien type Wordle/Loldle basé sur l'univers **Fairy Tail**. Le joueur doit deviner le personnage du jour ; chaque tentative révèle des attributs (genre, race, magie, affiliation...) comparés à la bonne réponse.

Objectif : proposer une meilleure exécution que les sites existants (ex. Mangadle.net), pas forcément une première mondiale sur l'univers.

## Cahier des charges

### Constat marché
- La quasi-totalité des univers manga/anime populaires ont déjà un "-dle" (Naruto, One Piece, MHA, JJK, Chainsaw Man, Fairy Tail...), souvent via des hubs génériques (Mangadle.net, Chardle.com, Animedle.org).
- Le Fairy Tail dle existant (Mangadle.net) n'a qu'un seul mode (Classic), ~122 personnages, un design template générique, et pas de fonctionnalités sociales au-delà d'un streak en local storage.
- **Angle choisi : faire mieux** (design/UX, plus de modes, data plus riche, progression locale plus poussée) plutôt que viser un univers vierge.

### Modes de jeu prévus
- [x] Classic (tableau d'attributs, avec en plus un système d'indices intégré : un indice supplémentaire — guilde, cheveux, genre, magie, race, statut — se débloque tous les 3 essais ratés)
- [ ] Citation (deviner via une réplique célèbre)
- [ ] Image floutée/zoomée (dézoom ou défloutage progressif à chaque essai)
- [ ] Emoji (deviner via une suite d'emojis représentant le perso)

### Progression / social
- Pas de compte utilisateur, pas de backend.
- Streak/historique calculés et stockés en local (localStorage) — pas affichés dans l'UI pour l'instant (retiré pour épurer la page principale).
- Partage de résultat façon Wordle (grille emoji copiable dans le presse-papier).

### Stack technique
- **Next.js** (React, TypeScript, App Router, Tailwind CSS, ESLint) — pas de backend, pas de compte.
- Déploiement sur **Vercel**.

### Données des personnages
- Format : JSON local (un fichier par personnage ou un fichier unique liste).
- Attributs Classic :
  - Nom, Genre, Race, Couleur cheveux, Couleur yeux, Attribut magique, Arme, Occupation, Affiliation, Premier arc (base identique à l'existant)
  - **Statut** (vivant / mort)
  - **Type de magie** (Caster / Holder)
  - **Saga anime d'apparition** (en plus du premier arc manga)
- Source : wiki Fairy Tail (fandom.com), infos et images récupérées via l'API MediaWiki (hotlink direct).
- Droits d'image : images fan-content non-officielles. **Décision : le site restera toujours gratuit, en accès libre, sans compte ni monétisation** — usage non-commercial confirmé durablement, pas seulement le temps du développement.
- Fond de page : wallpaper fan-art "Wallpaper by Inusuki | Fairy Tail © Hiro Mashima" (`public/background.jpg`), crédit affiché sur le site.

### Hébergement
- Vercel (cohérent avec le choix Next.js).

## Statut
Mode Classic jouable avec indices intégrés — Citation/Image floutée/Emoji à venir.
La recherche de personnage (autocomplete) affiche une miniature à côté de chaque nom.

---

## Développement

Projet Next.js standard (créé avec `create-next-app`).

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Déployé automatiquement sur Vercel à chaque push sur `main`.
