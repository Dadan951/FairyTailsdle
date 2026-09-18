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
  const { lang, ui } = useLanguage();

  if (guesses.length === 0) return null;

  const reversed = [...guesses].reverse();

  return (
    <div className="w-full max-w-6xl">
      {/* Desktop / tablette : une ligne par tentative */}
      <table className="hidden w-full table-fixed border-separate border-spacing-2 text-center text-sm sm:table">
        <colgroup>
          <col className="w-48" />
          {ATTRIBUTE_KEYS.map((key) => (
            <col key={key} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="px-1 py-2 text-left text-xs text-zinc-400">{ui.characterColumn}</th>
            {ATTRIBUTE_KEYS.map((key) => (
              <th key={key} className="px-1 py-2 text-xs text-zinc-400">
                {ATTRIBUTE_LABELS[lang][key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reversed.map((guess) => (
            <tr key={guess.character.id} className="animate-card-reveal">
              <td className="rounded-lg bg-zinc-900 px-2 py-2.5 text-left font-semibold text-zinc-50">
                <div className="flex items-center gap-3">
                  <Image
                    src={guess.character.image}
                    alt={guess.character.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-zinc-700"
                    unoptimized
                  />
                  <span className="truncate text-sm">{guess.character.name}</span>
                </div>
              </td>
              {ATTRIBUTE_KEYS.map((key, i) => {
                const attr = guess.attributes[key];
                return (
                  <td
                    key={key}
                    style={{ animationDelay: `${i * 140}ms` }}
                    className={`animate-attribute-reveal rounded-lg px-1.5 py-2 text-xs font-medium transition-transform duration-150 hover:scale-105 ${CELL_STYLES[attr.status]}`}
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

      {/* Mobile : une carte par tentative, attributs en grille lisible */}
      <div className="flex flex-col gap-3 sm:hidden">
        {reversed.map((guess) => (
          <div key={guess.character.id} className="animate-card-reveal rounded-lg bg-zinc-900 p-3 shadow-md">
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={guess.character.image}
                alt={guess.character.name}
                width={44}
                height={44}
                className="h-11 w-11 flex-shrink-0 rounded-full object-cover ring-2 ring-zinc-700"
                unoptimized
              />
              <span className="font-semibold text-zinc-50">{guess.character.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {ATTRIBUTE_KEYS.map((key, i) => {
                const attr = guess.attributes[key];
                return (
                  <div
                    key={key}
                    style={{ animationDelay: `${i * 140}ms` }}
                    className={`animate-attribute-reveal rounded-md px-1.5 py-1.5 text-center text-[11px] font-medium ${CELL_STYLES[attr.status]}`}
                  >
                    <div className="text-[9px] uppercase opacity-80">{ATTRIBUTE_LABELS[lang][key]}</div>
                    <div>
                      {translateValue(lang, attr.value)}
                      {arrowFor(attr.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
