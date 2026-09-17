# FairyTailsdle

Jeu quotidien type Wordle/Loldle basé sur l'univers **Fairy Tail**. Le joueur doit deviner le personnage du jour ; chaque tentative révèle des attributs (genre, race, magie, affiliation...) comparés à la bonne réponse.

Objectif : proposer une meilleure exécution que les sites existants (ex. Mangadle.net), pas forcément une première mondiale sur l'univers.

## Cahier des charges (en cours)

### Constat marché
- La quasi-totalité des univers manga/anime populaires ont déjà un "-dle" (Naruto, One Piece, MHA, JJK, Chainsaw Man, Fairy Tail...), souvent via des hubs génériques (Mangadle.net, Chardle.com, Animedle.org).
- Le Fairy Tail dle existant (Mangadle.net) n'a qu'un seul mode (Classic), ~122 personnages, un design template générique, et pas de fonctionnalités sociales au-delà d'un streak en local storage.
- **Angle choisi : faire mieux** (design/UX, plus de modes, data plus riche, progression locale plus poussée) plutôt que viser un univers vierge.

### Modes de jeu prévus
- [ ] Classic (tableau d'attributs, comme l'existant mais avec des attributs plus riches/à jour)
- [ ] Silhouette (silhouette du perso qui se révèle progressivement)
- [ ] Citation (deviner via une réplique célèbre)
- [ ] Image floutée/zoomée (dézoom ou défloutage progressif à chaque essai)
- [ ] Emoji (deviner via une suite d'emojis représentant le perso)

### Progression / social
- Pas de compte utilisateur, pas de backend.
- Stats enrichies en local (localStorage) : streak, historique, moyenne, etc.
- Partage de résultat façon Wordle (grille emoji copiable dans le presse-papier).

### Stack technique
- À définir (prochaine étape du cahier des charges).

### Données des personnages
- À définir : format (JSON), attributs retenus, source (wiki Fairy Tail), droits d'images.

### Hébergement
- À définir : probablement site statique (GitHub Pages / Vercel / Netlify).

## Statut
Projet en phase de cadrage — pas encore de code.
