"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { characters } from "@/data/characters";
import { compareGuess, getPuzzleNumber, getTodayCharacter, getTodayKey } from "@/lib/game";
import { DailyState, loadDailyState, loadStats, recordResult, saveDailyState, Stats } from "@/lib/storage";
import { ATTRIBUTE_KEYS, Character, GuessResult } from "@/lib/types";
import CharacterSearch from "@/components/CharacterSearch";
import GuessTable from "@/components/GuessTable";
import HintPanel from "@/components/HintPanel";
import Button from "@/components/Button";

/** Une case par essai (pas par attribut) : plus lisible qu'une grille de 12 colonnes. */
function guessScoreEmoji(guess: GuessResult): string {
  if (guess.isCorrect) return "🟩";
  const correctCount = ATTRIBUTE_KEYS.filter((key) => guess.attributes[key].status === "correct").length;
  return correctCount >= ATTRIBUTE_KEYS.length / 2 ? "🟨" : "🟥";
}

interface Session {
  guesses: GuessResult[];
  finished: boolean;
  won: boolean;
  stats: Stats | null;
}

const EMPTY_SESSION: Session = { guesses: [], finished: false, won: false, stats: null };

function pickRandomCharacter(excludeId: number): Character {
  const pool = characters.filter((c) => c.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Home() {
  const today = useMemo(() => new Date(), []);
  const dateKey = useMemo(() => getTodayKey(today), [today]);
  const puzzleNumber = useMemo(() => getPuzzleNumber(today), [today]);
  const dailyAnswer = useMemo(() => getTodayCharacter(today), [today]);

  // Une fois le défi du jour trouvé, "Rejouer" bascule sur un personnage aléatoire
  // pour une partie bonus, sans toucher à la sauvegarde/aux stats du défi du jour.
  const [practiceAnswer, setPracticeAnswer] = useState<Character | null>(null);
  const answer = practiceAnswer ?? dailyAnswer;
  const isPracticing = practiceAnswer !== null;

  // Le rendu serveur/premier rendu client démarre vide (localStorage n'existe pas côté serveur,
  // donc on ne peut pas le lire dans l'état initial sans provoquer un mismatch d'hydratation).
  const [session, setSession] = useState<Session>(EMPTY_SESSION);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const daily: DailyState = loadDailyState("classic", dateKey);
    const restoredGuesses = daily.guessIds
      .map((id) => characters.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => compareGuess(c, dailyAnswer));

    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation ponctuelle avec localStorage (indisponible côté serveur), pas de source de vérité React alternative ici.
    setSession({
      guesses: restoredGuesses,
      finished: daily.finished,
      won: daily.won,
      stats: loadStats("classic"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  function persist(nextGuesses: GuessResult[], nextFinished: boolean, nextWon: boolean) {
    const state: DailyState = {
      guessIds: nextGuesses.map((g) => g.character.id),
      finished: nextFinished,
      won: nextWon,
    };
    saveDailyState("classic", dateKey, state);
  }

  function handleGuess(characterId: number) {
    if (session.finished) return;
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    const result = compareGuess(character, answer);
    const nextGuesses = [...session.guesses, result];

    if (result.isCorrect) {
      if (!isPracticing) {
        persist(nextGuesses, true, true);
      }
      setSession({
        guesses: nextGuesses,
        finished: true,
        won: true,
        stats: isPracticing ? session.stats : recordResult("classic", dateKey, true, nextGuesses.length),
      });
    } else {
      if (!isPracticing) {
        persist(nextGuesses, false, false);
      }
      setSession((prev) => ({ ...prev, guesses: nextGuesses }));
    }
  }

  function handleReplay() {
    setPracticeAnswer(pickRandomCharacter(answer.id));
    setSession((prev) => ({ ...prev, guesses: [], finished: false, won: false }));
  }

  function handleShare() {
    const scoreLine = session.guesses.map(guessScoreEmoji).join("");
    const text = [
      `FairyTailsdle #${puzzleNumber}`,
      session.won
        ? `Trouvé en ${session.guesses.length} essai${session.guesses.length > 1 ? "s" : ""}`
        : "Pas trouvé aujourd'hui 😔",
      "",
      scoreLine,
      "",
      "🟩 bonne réponse  🟨 proche  🟥 loin",
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
    <div className="relative flex min-h-screen flex-col items-center gap-6 px-4 py-10 text-zinc-50">
      <header className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-pink-400">FairyTailsdle</h1>
        <p className="text-sm text-zinc-400">
          {isPracticing
            ? "Partie bonus — ne compte pas dans le défi du jour"
            : `Devine le personnage Fairy Tail du jour #${puzzleNumber}`}
        </p>
      </header>

      {!session.finished && (
        <CharacterSearch
          characters={characters}
          excludeIds={guessedIds}
          onGuess={(c) => handleGuess(c.id)}
        />
      )}

      {!session.finished && <HintPanel answer={answer} guessCount={session.guesses.length} />}

      {session.finished && (
        <div className="animate-card-reveal flex w-full max-w-lg flex-col items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-5 text-center">
          <Image
            src={answer.image}
            alt={answer.name}
            width={120}
            height={120}
            className="h-28 w-28 rounded-lg object-cover"
            unoptimized
          />
          <p className="text-lg font-bold">
            {session.won ? "Bien joué !" : "Dommage !"} C&apos;était{" "}
            <span className="text-pink-400">{answer.name}</span>
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleShare}>
              {copied ? "Copié !" : "Partager mon résultat"}
            </Button>
            <Button variant="secondary" onClick={handleReplay}>
              Rejouer
            </Button>
          </div>
        </div>
      )}

      <GuessTable guesses={session.guesses} />
    </div>
  );
}
