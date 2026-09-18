import { characters, ARC_ORDER, SAGA_ORDER } from "@/data/characters";
import {
  ATTRIBUTE_KEYS,
  AttributeKey,
  Character,
  GuessResult,
  ORDINAL_ATTRIBUTES,
} from "@/lib/types";

const LAUNCH_DATE = new Date("2026-09-17T00:00:00Z");

/** Chaîne AAAA-MM-JJ dans le fuseau local du joueur, utilisée comme clé du jour. */
export function getTodayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysSinceLaunch(date: Date): number {
  const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diffMs = utcMidnight - LAUNCH_DATE.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/** Numéro du jeu du jour (#1, #2, ...) — utilisé pour l'affichage et le partage. */
export function getPuzzleNumber(date: Date = new Date()): number {
  return daysSinceLaunch(date) + 1;
}

/** Personnage du jour, déterministe (même joueur = même personnage toute la journée). */
export function getTodayCharacter(date: Date = new Date()): Character {
  const index = daysSinceLaunch(date) % characters.length;
  return characters[index];
}

function getOrderIndex(value: string, order: readonly string[]): number {
  return order.indexOf(value);
}

function compareOrdinal(
  guessValue: string,
  answerValue: string,
  order: readonly string[]
): "correct" | "higher" | "lower" {
  if (guessValue === answerValue) return "correct";
  const guessIndex = getOrderIndex(guessValue, order);
  const answerIndex = getOrderIndex(answerValue, order);
  return guessIndex < answerIndex ? "higher" : "lower";
}

const ORDER_MAP: Partial<Record<AttributeKey, readonly string[]>> = {
  firstArc: ARC_ORDER,
  animeSaga: SAGA_ORDER,
};

export function compareGuess(guess: Character, answer: Character): GuessResult {
  const attributes = {} as GuessResult["attributes"];

  for (const key of ATTRIBUTE_KEYS) {
    const guessValue = guess[key];
    const answerValue = answer[key];

    if (ORDINAL_ATTRIBUTES.includes(key)) {
      const order = ORDER_MAP[key]!;
      attributes[key] = {
        value: guessValue,
        status: compareOrdinal(guessValue, answerValue, order),
      };
    } else {
      attributes[key] = {
        value: guessValue,
        status: guessValue === answerValue ? "correct" : "incorrect",
      };
    }
  }

  return {
    character: guess,
    attributes,
    isCorrect: guess.id === answer.id,
  };
}
