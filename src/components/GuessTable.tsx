import Image from "next/image";
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS, GuessResult } from "@/lib/types";

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
  if (guesses.length === 0) return null;

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      {[...guesses].reverse().map((guess) => (
        <div
          key={guess.character.id}
          className="animate-card-reveal rounded-lg bg-zinc-900 p-3 shadow-md"
        >
          <div className="mb-2 flex items-center gap-2">
            <Image
              src={guess.character.image}
              alt={guess.character.name}
              width={40}
              height={40}
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
              unoptimized
            />
            <span className="font-semibold text-zinc-50">{guess.character.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {ATTRIBUTE_KEYS.map((key, i) => {
              const attr = guess.attributes[key];
              return (
                <div
                  key={key}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={`animate-attribute-reveal rounded-md px-2 py-1.5 text-center text-xs font-medium transition-transform duration-150 hover:scale-105 ${CELL_STYLES[attr.status]}`}
                >
                  <div className="text-[10px] uppercase opacity-80">{ATTRIBUTE_LABELS[key]}</div>
                  <div>
                    {attr.value}
                    {arrowFor(attr.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
