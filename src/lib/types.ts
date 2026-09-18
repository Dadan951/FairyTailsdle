export type MagicType = "Caster" | "Holder" | "None";
export type Status = "Alive" | "Dead" | "Unknown";

export interface Character {
  id: number;
  name: string;
  image: string;
  gender: string;
  race: string;
  hairColor: string;
  eyeColor: string;
  magicAttribute: string;
  magicType: MagicType;
  weapon: string;
  occupation: string;
  affiliation: string;
  status: Status;
  firstArc: string;
  animeSaga: string;
}

export const ATTRIBUTE_KEYS = [
  "gender",
  "hairColor",
  "magicAttribute",
  "weapon",
  "occupation",
  "affiliation",
  "status",
  "firstArc",
  "animeSaga",
] as const;

export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];

export const ORDINAL_ATTRIBUTES: AttributeKey[] = ["firstArc", "animeSaga"];

export type CellStatus = "correct" | "incorrect" | "higher" | "lower";

export interface AttributeResult {
  value: string;
  status: CellStatus;
}

export interface GuessResult {
  character: Character;
  attributes: Record<AttributeKey, AttributeResult>;
  isCorrect: boolean;
}
