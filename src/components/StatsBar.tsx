import { Stats } from "@/lib/storage";

interface StatsBarProps {
  stats: Stats;
}

function average(history: Record<string, number>): string {
  const values = Object.values(history);
  if (values.length === 0) return "-";
  const sum = values.reduce((a, b) => a + b, 0);
  return (sum / values.length).toFixed(1);
}

export default function StatsBar({ stats }: StatsBarProps) {
  const winRate =
    stats.totalPlayed === 0 ? "-" : `${Math.round((stats.totalWon / stats.totalPlayed) * 100)}%`;

  const items = [
    { label: "Série actuelle", value: stats.streak },
    { label: "Meilleure série", value: stats.bestStreak },
    { label: "Parties jouées", value: stats.totalPlayed },
    { label: "Taux de réussite", value: winRate },
    { label: "Essais moyens", value: average(stats.history) },
  ];

  return (
    <div className="grid w-full max-w-2xl grid-cols-3 gap-3 sm:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-3"
        >
          <span className="text-xl font-bold text-zinc-50">{item.value}</span>
          <span className="mt-1 text-center text-xs text-zinc-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
