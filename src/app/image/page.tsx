"use client";

import { useEffect, useMemo, useState } from "react";
import { characters } from "@/data/characters";
import { useLanguage } from "@/context/LanguageContext";
import { getPuzzleNumber, getTodayCharacter, getTodayKey } from "@/lib/game";
import { DailyState, loadDailyState, loadStats, recordResult, saveDailyState, Stats } from "@/lib/storage";
import { Character } from "@/lib/types";
import CharacterSearch from "@/components/CharacterSearch";
import GuessList from "@/components/GuessList";
import PixelatedImage from "@/components/PixelatedImage";
import Button from "@/components/Button";

const MODE = "image" as const;
/** Nombre d'essais ratés pour atteindre la netteté maximale. */
const GUESSES_TO_FULL_CLARITY = 8;

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

function pickRandomCharacter(excludeId: number): Character {
  const pool = characters.filter((c) => c.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ImagePage() {
  const { ui } = useLanguage();
  const today = useMemo(() => new Date(), []);
  const dateKey = useMemo(() => getTodayKey(today), [today]);
  const puzzleNumber = useMemo(() => getPuzzleNumber(today), [today]);
  const dailyAnswer = useMemo(() => getTodayCharacter(today), [today]);

  const [practiceAnswer, setPracticeAnswer] = useState<Character | null>(null);
  const answer = practiceAnswer ?? dailyAnswer;
  const isPracticing = practiceAnswer !== null;

  const [session, setSession] = useState<Session>(EMPTY_SESSION);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const daily: DailyState = loadDailyState(MODE, dateKey);
    const restoredGuesses = daily.guessIds
      .map((id) => characters.find((c) => c.id === id))
      .filter((c): c is Character => Boolean(c))
      .map((c) => ({ character: c, correct: c.id === dailyAnswer.id }));

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
      if (!isPracticing) persist(nextGuesses, true, true);
      setSession({
        guesses: nextGuesses,
        finished: true,
        won: true,
        stats: isPracticing ? session.stats : recordResult(MODE, dateKey, true, nextGuesses.length),
      });
    } else {
      if (!isPracticing) persist(nextGuesses, false, false);
      setSession((prev) => ({ ...prev, guesses: nextGuesses }));
    }
  }

  function handleReplay() {
    setPracticeAnswer(pickRandomCharacter(answer.id));
    setSession((prev) => ({ ...prev, guesses: [], finished: false, won: false }));
  }

  function handleShare() {
    const text = [
      `FairyTailsdle 🖼️ #${puzzleNumber}`,
      session.won ? ui.shareFoundIn(session.guesses.length) : ui.shareNotFound,
    ].join("\n");

    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        window.prompt(ui.sharePromptTitle, text);
      }
    );
  }

  const guessedIds = session.guesses.map((g) => g.character.id);
  const clarity = session.finished ? 1 : session.guesses.length / GUESSES_TO_FULL_CLARITY;

  return (
    <div className="relative flex min-h-screen flex-col items-center gap-6 px-4 py-10 text-zinc-50">
      <header className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm text-zinc-400">
          {isPracticing ? ui.practiceSubtitle : ui.imageSubtitle(puzzleNumber)}
        </p>
      </header>

      <PixelatedImage src={answer.image} alt={answer.name} clarity={clarity} />

      {!session.finished && (
        <CharacterSearch
          characters={characters}
          excludeIds={guessedIds}
          onGuess={(c) => handleGuess(c.id)}
        />
      )}

      {session.finished && (
        <div className="animate-card-reveal flex w-full max-w-lg flex-col items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-5 text-center">
          <p className="text-lg font-bold">
            {session.won ? ui.won : ui.lost} {ui.itWas}{" "}
            <span className="text-pink-400">{answer.name}</span>
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleShare}>
              {copied ? ui.copied : ui.share}
            </Button>
            <Button variant="secondary" onClick={handleReplay}>
              {ui.replay}
            </Button>
          </div>
        </div>
      )}

      <GuessList guesses={session.guesses.map((g) => ({ name: g.character.name, correct: g.correct }))} />
    </div>
  );
}
