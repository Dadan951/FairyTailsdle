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
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[900px] border-separate border-spacing-1 text-center text-sm">
        <thead>
          <tr>
            <th className="px-2 py-2 text-zinc-400">Personnage</th>
            {ATTRIBUTE_KEYS.map((key) => (
              <th key={key} className="px-2 py-2 text-zinc-400">
                {ATTRIBUTE_LABELS[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...guesses].reverse().map((guess) => (
            <tr key={guess.character.id}>
              <td className="rounded-lg bg-zinc-800 px-3 py-3 font-semibold text-zinc-50">
                {guess.character.name}
              </td>
              {ATTRIBUTE_KEYS.map((key) => {
                const attr = guess.attributes[key];
                return (
                  <td
                    key={key}
                    className={`rounded-lg px-2 py-3 font-medium ${CELL_STYLES[attr.status]}`}
                  >
                    {attr.value}
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
