"use client";

import { useEffect, useMemo, useState } from "react";
import { characters } from "@/data/characters";
import { getPuzzleNumber, getTodayCharacter, getTodayKey } from "@/lib/game";
import { unlockedHintCount } from "@/lib/hints";
import { DailyState, loadDailyState, loadStats, recordResult, saveDailyState, Stats } from "@/lib/storage";
import { Character } from "@/lib/types";
import CharacterSearch from "@/components/CharacterSearch";
import GuessList from "@/components/GuessList";
import HintPanel from "@/components/HintPanel";
import ModeNav from "@/components/ModeNav";
import SilhouetteImage from "@/components/SilhouetteImage";
import StatsBar from "@/components/StatsBar";

const MODE = "silhouette" as const;

interface Guess {
  character: Character;
  correct: boolean;
}

interface Session {
  guesses: Guess[];
  finished: boolean;
  won: boolean;
  stats: Stats | null;
}

const EMPTY_SESSION: Session = { guesses: [], finished: false, won: false, stats: null };

export default function SilhouettePage() {
  const today = useMemo(() => new Date(), []);
  const dateKey = useMemo(() => getTodayKey(today), [today]);
  const puzzleNumber = useMemo(() => getPuzzleNumber(today), [today]);
  const answer = useMemo(() => getTodayCharacter(today), [today]);

  const [session, setSession] = useState<Session>(EMPTY_SESSION);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const daily: DailyState = loadDailyState(MODE, dateKey);
    const restoredGuesses = daily.guessIds
      .map((id) => characters.find((c) => c.id === id))
      .filter((c): c is Character => Boolean(c))
      .map((c) => ({ character: c, correct: c.id === answer.id }));

    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation ponctuelle avec localStorage (indisponible côté serveur), pas de source de vérité React alternative ici.
    setSession({
      guesses: restoredGuesses,
      finished: daily.finished,
      won: daily.won,
      stats: loadStats(MODE),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  function persist(nextGuesses: Guess[], nextFinished: boolean, nextWon: boolean) {
    const state: DailyState = {
      guessIds: nextGuesses.map((g) => g.character.id),
      finished: nextFinished,
      won: nextWon,
    };
    saveDailyState(MODE, dateKey, state);
  }

  function handleGuess(characterId: number) {
    if (session.finished) return;
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    const correct = character.id === answer.id;
    const nextGuesses = [...session.guesses, { character, correct }];

    if (correct) {
      persist(nextGuesses, true, true);
      setSession({
        guesses: nextGuesses,
        finished: true,
        won: true,
        stats: recordResult(MODE, dateKey, true, nextGuesses.length),
      });
    } else {
      persist(nextGuesses, false, false);
      setSession((prev) => ({ ...prev, guesses: nextGuesses }));
    }
  }

  function handleShare() {
    const hintsUsed = unlockedHintCount(session.guesses.length);
    const text = [
      `FairyTailsdle Silhouette #${puzzleNumber}`,
      session.won
        ? `Trouvé en ${session.guesses.length} essai${session.guesses.length > 1 ? "s" : ""} (${hintsUsed} indice${hintsUsed > 1 ? "s" : ""}) 🎉`
        : "Pas trouvé aujourd'hui 😔",
    ].join("\n");

    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        window.prompt("Copie ton résultat :", text);
      }
    );
  }

  const guessedIds = session.guesses.map((g) => g.character.id);

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-950 px-4 py-10 text-zinc-50">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-pink-400">FairyTailsdle</h1>
        <p className="text-sm text-zinc-400">
          Devine le personnage à sa silhouette — Puzzle #{puzzleNumber}
        </p>
        <ModeNav />
      </header>

      {session.stats && <StatsBar stats={session.stats} />}

      <SilhouetteImage src={answer.image} alt={answer.name} revealed={session.finished} />

      {!session.finished && <HintPanel answer={answer} guessCount={session.guesses.length} />}

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

      <GuessList guesses={session.guesses.map((g) => ({ name: g.character.name, correct: g.correct }))} />
    </div>
  );
}
