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
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-pink-500/60 hover:shadow-lg hover:shadow-pink-600/20"
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-pink-600 to-fuchsia-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <span className="flex flex-col">
        <span className="text-lg font-bold text-zinc-50 transition-colors group-hover:text-pink-400">
          {title}
        </span>
        <span className="text-sm text-zinc-400">{description}</span>
      </span>
      <span className="text-xl text-zinc-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-pink-400">
        →
      </span>
    </Link>
  );
}
