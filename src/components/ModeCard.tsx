import Link from "next/link";

interface ModeCardProps {
  href: string;
  title: string;
  description: string;
}

export default function ModeCard({ href, title, description }: ModeCardProps) {
  return (
    <Link
      href={href}
      className="group flex w-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-pink-500/60 hover:shadow-lg hover:shadow-pink-600/20"
    >
      <span className="text-lg font-bold text-zinc-50 transition-colors group-hover:text-pink-400">
        {title}
      </span>
      <span className="text-sm text-zinc-400">{description}</span>
    </Link>
  );
}
