interface PracticeBadgeProps {
  label: string;
}

export default function PracticeBadge({ label }: PracticeBadgeProps) {
  return (
    <span className="animate-card-reveal inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 px-4 py-1.5 text-sm font-semibold text-amber-300 shadow-md shadow-amber-500/10">
      <span className="text-base">🎲</span>
      {label}
    </span>
  );
}
