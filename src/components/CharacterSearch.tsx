"use client";

import { useMemo, useState } from "react";
import { Character } from "@/lib/types";

interface CharacterSearchProps {
  characters: Character[];
  excludeIds: number[];
  disabled?: boolean;
  onGuess: (character: Character) => void;
}

export default function CharacterSearch({
  characters,
  excludeIds,
  disabled,
  onGuess,
}: CharacterSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (query.trim().length === 0) return [];
    const normalized = query.trim().toLowerCase();
    return characters
      .filter((c) => !excludeIds.includes(c.id))
      .filter((c) => c.name.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query, characters, excludeIds]);

  function handleSelect(character: Character) {
    onGuess(character);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Nom d'un personnage Fairy Tail..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-50 placeholder-zinc-500 outline-none focus:border-pink-500 disabled:opacity-50"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(c)}
                className="w-full px-4 py-2 text-left text-zinc-50 hover:bg-pink-600/20"
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
