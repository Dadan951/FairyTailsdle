interface GuessListProps {
  guesses: { name: string; correct: boolean }[];
}

export default function GuessList({ guesses }: GuessListProps) {
  if (guesses.length === 0) return null;

  return (
    <ul className="flex w-full max-w-md flex-col gap-2">
      {[...guesses].reverse().map((g, i) => (
        <li
          key={`${g.name}-${i}`}
          className={`rounded-lg px-4 py-2 text-center font-semibold ${
            g.correct ? "bg-emerald-600 text-white" : "bg-rose-700 text-white"
          }`}
        >
          {g.name}
        </li>
      ))}
    </ul>
  );
}
