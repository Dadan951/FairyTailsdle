import { AttributeKey } from "@/lib/types";

export type Lang = "fr" | "en";

export const ATTRIBUTE_LABELS: Record<Lang, Record<AttributeKey, string>> = {
  fr: {
    gender: "Genre",
    race: "Race",
    hairColor: "Cheveux",
    eyeColor: "Yeux",
    magicAttribute: "Magie",
    magicType: "Type",
    weapon: "Arme",
    occupation: "Occupation",
    affiliation: "Guilde",
    status: "Statut",
    firstArc: "Premier arc",
    animeSaga: "Saga",
  },
  en: {
    gender: "Gender",
    race: "Race",
    hairColor: "Hair",
    eyeColor: "Eyes",
    magicAttribute: "Magic",
    magicType: "Type",
    weapon: "Weapon",
    occupation: "Occupation",
    affiliation: "Guild",
    status: "Status",
    firstArc: "First arc",
    animeSaga: "Saga",
  },
};

/**
 * Les valeurs des personnages (characters.ts) sont stockées en anglais (langue canonique,
 * utilisée pour la comparaison des essais). Cette table ne sert qu'à l'affichage en français ;
 * en anglais on affiche la valeur brute telle quelle.
 */
const VALUE_FR: Record<string, string> = {
  // Genre
  Male: "Homme",
  Female: "Femme",
  // Race
  Human: "Humain",
  Exceed: "Exceed",
  Demon: "Démon",
  Dragon: "Dragon",
  // Couleurs (cheveux / yeux)
  Pink: "Rose",
  Blonde: "Blond",
  Black: "Noir",
  Red: "Rouge",
  Blue: "Bleu",
  White: "Blanc",
  Brown: "Marron",
  Orange: "Orange",
  Green: "Vert",
  Purple: "Violet",
  Dark: "Sombre",
  Yellow: "Jaune",
  Grey: "Gris",
  // Magie
  "Fire Magic": "Magie du Feu",
  "Spatial/Dimensional Magic": "Magie Spatiale/Dimensionnelle",
  "Ice Magic": "Magie de Glace",
  "Other/Unique Magic": "Magie Unique",
  "Wind/Air Magic": "Magie du Vent",
  "Metal Magic": "Magie du Métal",
  "Water Magic": "Magie de l'Eau",
  "Body/Transformation Magic": "Magie de Transformation",
  "Light/Shadow Magic": "Magie de Lumière/Ombre",
  "Time Magic": "Magie du Temps",
  "Enchantment/Curse Magic": "Magie d'Enchantement",
  // Type de magie
  Caster: "Manipulation",
  Holder: "Statique",
  // Arme
  None: "Aucune",
  Whip: "Fouet",
  Blade: "Lame",
  Sword: "Épée",
  Fan: "Éventail",
  // Occupation
  Mage: "Mage",
  Pet: "Animal de compagnie",
  Ruler: "Dirigeant",
  // Statut
  Alive: "Vivant",
  Dead: "Mort",
  // Arcs (manga)
  "Macao arc": "Arc Macao",
  "Edolas arc": "Arc d'Edolas",
  "Phantom Lord arc": "Arc de Phantom Lord",
  "Battle of Fairy Tail arc": "Arc de la Bataille de Fairy Tail",
  "Tower of Heaven arc": "Arc de la Tour du Paradis",
  "Tenrou Island arc": "Arc de l'Île Tenrou",
  "Grand Magic Games arc": "Arc des Grands Jeux de la Magie",
  "Tartaros arc": "Arc de Tartaros",
  "Alvarez arc": "Arc d'Alvarez",
  // Sagas (anime)
  "Macao Saga": "Saga Macao",
  "Edolas Saga": "Saga d'Edolas",
  "Phantom Lord Saga": "Saga de Phantom Lord",
  "Battle of Fairy Tail Saga": "Saga de la Bataille de Fairy Tail",
  "Tower of Heaven Saga": "Saga de la Tour du Paradis",
  "Tenrou Island Saga": "Saga de l'Île Tenrou",
  "Grand Magic Games Saga": "Saga des Grands Jeux de la Magie",
  "Tartaros Saga": "Saga de Tartaros",
  "Alvarez Empire Saga": "Saga de l'Empire d'Alvarez",
};

export function translateValue(lang: Lang, value: string): string {
  if (lang === "en") return value;
  return VALUE_FR[value] ?? value;
}

export const UI_TEXT = {
  fr: {
    searchPlaceholder: "Nom d'un personnage Fairy Tail...",
    subtitle: (n: number) => `Devine le personnage Fairy Tail du jour #${n}`,
    practiceSubtitle: "Partie bonus — ne compte pas dans le défi du jour",
    nextHintIn: (n: number) => `Prochain indice dans ${n} essai${n > 1 ? "s" : ""}`,
    allHintsUnlocked: "Tous les indices sont débloqués",
    won: "Bien joué !",
    lost: "Dommage !",
    itWas: "C'était",
    share: "Partager mon résultat",
    copied: "Copié !",
    replay: "Rejouer",
    shareFoundIn: (n: number) => `Trouvé en ${n} essai${n > 1 ? "s" : ""}`,
    shareNotFound: "Pas trouvé aujourd'hui 😔",
    shareLegend: "🟩 bonne réponse  🟨 proche  🟥 loin",
    sharePromptTitle: "Copie ton résultat :",
    homeTitle: "FairyTailsdle",
    homeSubtitle: "Devine les personnages de Fairy Tail",
    classicModeTitle: "Classique",
    classicModeDesc: "Des indices à chaque essai",
    imageModeTitle: "Image",
    imageModeDesc: "Devine avec une image pixelisée",
    imageSubtitle: (n: number) => `Devine le personnage grâce à l'image #${n}`,
    pixelHint: (level: number, max: number) => `Netteté ${level}/${max}`,
  },
  en: {
    searchPlaceholder: "Fairy Tail character name...",
    subtitle: (n: number) => `Guess today's Fairy Tail character #${n}`,
    practiceSubtitle: "Bonus round — doesn't count toward today's challenge",
    nextHintIn: (n: number) => `Next hint in ${n} guess${n > 1 ? "es" : ""}`,
    allHintsUnlocked: "All hints unlocked",
    won: "Well played!",
    lost: "Too bad!",
    itWas: "It was",
    share: "Share my result",
    copied: "Copied!",
    replay: "Play again",
    shareFoundIn: (n: number) => `Found in ${n} guess${n > 1 ? "es" : ""}`,
    shareNotFound: "Not found today 😔",
    shareLegend: "🟩 correct  🟨 close  🟥 far",
    sharePromptTitle: "Copy your result:",
    homeTitle: "FairyTailsdle",
    homeSubtitle: "Guess the Fairy Tail characters",
    classicModeTitle: "Classic",
    classicModeDesc: "A hint on every guess",
    imageModeTitle: "Image",
    imageModeDesc: "Guess from a pixelated image",
    imageSubtitle: (n: number) => `Guess the character from the image #${n}`,
    pixelHint: (level: number, max: number) => `Sharpness ${level}/${max}`,
  },
} satisfies Record<Lang, Record<string, unknown>>;
