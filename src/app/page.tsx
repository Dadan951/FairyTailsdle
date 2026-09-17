"use client";

import { useEffect, useMemo, useState } from "react";
import { characters } from "@/data/characters";
import { compareGuess, getPuzzleNumber, getTodayCharacter, getTodayKey } from "@/lib/game";
import { DailyState, loadDailyState, loadStats, recordResult, saveDailyState, Stats } from "@/lib/storage";
import { ATTRIBUTE_KEYS, GuessResult } from "@/lib/types";
import CharacterSearch from "@/components/CharacterSearch";
import GuessTable from "@/components/GuessTable";
import StatsBar from "@/components/StatsBar";

const EMOJI: Record<string, string> = {
  correct: "🟩",
  incorrect: "🟥",
  higher: "🟨",
  lower: "🟨",
};

interface Session {
  guesses: GuessResult[];
  finished: boolean;
  won: boolean;
  stats: Stats | null;
}

const EMPTY_SESSION: Session = { guesses: [], finished: false, won: false, stats: null };

export default function Home() {
  const today = useMemo(() => new Date(), []);
  const dateKey = useMemo(() => getTodayKey(today), [today]);
  const puzzleNumber = useMemo(() => getPuzzleNumber(today), [today]);
  const answer = useMemo(() => getTodayCharacter(today), [today]);

  // Le rendu serveur/premier rendu client démarre vide (localStorage n'existe pas côté serveur,
  // donc on ne peut pas le lire dans l'état initial sans provoquer un mismatch d'hydratation).
  const [session, setSession] = useState<Session>(EMPTY_SESSION);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const daily: DailyState = loadDailyState(dateKey);
    const restoredGuesses = daily.guessIds
      .map((id) => characters.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => compareGuess(c, answer));

    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation ponctuelle avec localStorage (indisponible côté serveur), pas de source de vérité React alternative ici.
    setSession({
      guesses: restoredGuesses,
      finished: daily.finished,
      won: daily.won,
      stats: loadStats(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  function persist(nextGuesses: GuessResult[], nextFinished: boolean, nextWon: boolean) {
    const state: DailyState = {
      guessIds: nextGuesses.map((g) => g.character.id),
      finished: nextFinished,
      won: nextWon,
    };
    saveDailyState(dateKey, state);
  }

  function handleGuess(characterId: number) {
    if (session.finished) return;
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    const result = compareGuess(character, answer);
    const nextGuesses = [...session.guesses, result];

    if (result.isCorrect) {
      persist(nextGuesses, true, true);
      setSession({
        guesses: nextGuesses,
        finished: true,
        won: true,
        stats: recordResult(dateKey, true, nextGuesses.length),
      });
    } else {
      persist(nextGuesses, false, false);
      setSession((prev) => ({ ...prev, guesses: nextGuesses }));
    }
  }

  function handleShare() {
    const lines = session.guesses.map((g) =>
      ATTRIBUTE_KEYS.map((key) => EMOJI[g.attributes[key].status]).join("")
    );
    const text = [
      `FairyTailsdle #${puzzleNumber}`,
      session.won
        ? `Trouvé en ${session.guesses.length} essai${session.guesses.length > 1 ? "s" : ""} 🎉`
        : "Pas trouvé aujourd'hui 😔",
      ...lines,
    ].join("\n");

    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        // Presse-papier indisponible (permissions navigateur) : on affiche le résultat pour copie manuelle.
        window.prompt("Copie ton résultat :", text);
      }
    );
  }

  const guessedIds = session.guesses.map((g) => g.character.id);

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-950 px-4 py-10 text-zinc-50">
      <header className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-pink-400">FairyTailsdle</h1>
        <p className="text-sm text-zinc-400">Devine le personnage Fairy Tail du jour — Puzzle #{puzzleNumber}</p>
      </header>

      {session.stats && <StatsBar stats={session.stats} />}

      {!session.finished && (
        <CharacterSearch
          characters={characters}
          excludeIds={guessedIds}
          onGuess={(c) => handleGuess(c.id)}
        />
      )}

      {session.finished && (
        <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-5 text-center">
          <p className="text-lg font-bold">
            {session.won ? "🎉 Bien joué !" : "Dommage !"} C&apos;était{" "}
            <span className="text-pink-400">{answer.name}</span>
          </p>
          <button
            onClick={handleShare}
            className="rounded-full bg-pink-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-pink-500"
          >
            {copied ? "Copié !" : "Partager mon résultat"}
          </button>
        </div>
      )}

      <GuessTable guesses={session.guesses} />
    </div>
  );
}
