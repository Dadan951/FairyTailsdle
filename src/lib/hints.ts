import { AttributeKey } from "@/lib/types";

/** Ordre de déblocage des indices en mode Silhouette (un tous les 3 essais). */
export const HINT_ATTRIBUTES: AttributeKey[] = [
  "affiliation",
  "hairColor",
  "gender",
  "magicAttribute",
  "race",
  "status",
];

export const GUESSES_PER_HINT = 3;

export function unlockedHintCount(guessCount: number): number {
  return Math.min(Math.floor(guessCount / GUESSES_PER_HINT), HINT_ATTRIBUTES.length);
}

export function guessesUntilNextHint(guessCount: number): number {
  const unlocked = unlockedHintCount(guessCount);
  if (unlocked >= HINT_ATTRIBUTES.length) return 0;
  return GUESSES_PER_HINT - (guessCount % GUESSES_PER_HINT);
}
