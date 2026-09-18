"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ATTRIBUTE_LABELS, translateValue } from "@/lib/i18n";
import { guessesUntilNextHint, HINT_ATTRIBUTES, unlockedHintCount } from "@/lib/hints";
import { AttributeKey, Character } from "@/lib/types";

interface HintPanelProps {
  answer: Character;
  guessCount: number;
}

export default function HintPanel({ answer, guessCount }: HintPanelProps) {
  const { lang, ui } = useLanguage();
  const unlocked = unlockedHintCount(guessCount);
  const remaining = guessesUntilNextHint(guessCount);

  return (
    <div className="flex w-full max-w-lg flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-center text-sm text-zinc-400">
        {unlocked >= HINT_ATTRIBUTES.length ? ui.allHintsUnlocked : ui.nextHintIn(remaining)}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {HINT_ATTRIBUTES.map((key: AttributeKey, i) => {
          const isUnlocked = i < unlocked;
          return (
            <span
              key={key}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 ease-out ${
                isUnlocked
                  ? "scale-105 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow-md shadow-pink-600/30"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {ATTRIBUTE_LABELS[lang][key]} : {isUnlocked ? translateValue(lang, answer[key]) : "???"}
            </span>
          );
        })}
      </div>
    </div>
  );
}
