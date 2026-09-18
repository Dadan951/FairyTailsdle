"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { ATTRIBUTE_LABELS, translateValue } from "@/lib/i18n";
import { ATTRIBUTE_KEYS, GuessResult } from "@/lib/types";

interface GuessTableProps {
  guesses: GuessResult[];
}

const CELL_STYLES: Record<string, string> = {
  correct: "bg-emerald-600 text-white",
  incorrect: "bg-rose-700 text-white",
  higher: "bg-amber-500 text-white",
  lower: "bg-amber-500 text-white",
};

function arrowFor(status: string) {
  if (status === "higher") return " ▲";
  if (status === "lower") return " ▼";
  return "";
}

export default function GuessTable({ guesses }: GuessTableProps) {
  const { lang } = useLanguage();

  if (guesses.length === 0) return null;

  return (
    <div className="w-full max-w-6xl overflow-x-auto rounded-lg">
      <table className="w-full min-w-[760px] border-separate border-spacing-1 text-center text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-zinc-950 px-2 py-2 text-zinc-400">
              {/* personnage */}
            </th>
            {ATTRIBUTE_KEYS.map((key) => (
              <th key={key} className="px-2 py-2 text-xs text-zinc-400">
                {ATTRIBUTE_LABELS[lang][key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...guesses].reverse().map((guess) => (
            <tr key={guess.character.id} className="animate-card-reveal">
              <td className="sticky left-0 z-10 rounded-lg bg-zinc-900 px-3 py-2 text-left font-semibold text-zinc-50">
                <div className="flex items-center gap-2">
                  <Image
                    src={guess.character.image}
                    alt={guess.character.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                    unoptimized
                  />
                  <span className="whitespace-nowrap">{guess.character.name}</span>
                </div>
              </td>
              {ATTRIBUTE_KEYS.map((key, i) => {
                const attr = guess.attributes[key];
                return (
                  <td
                    key={key}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className={`animate-attribute-reveal whitespace-nowrap rounded-lg px-2 py-2 font-medium transition-transform duration-150 hover:scale-105 ${CELL_STYLES[attr.status]}`}
                  >
                    {translateValue(lang, attr.value)}
                    {arrowFor(attr.status)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
