import Link from "next/link";

interface ModeCardProps {
  href: string;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
}

export default function ModeCard({ href, icon, iconBg, title, description }: ModeCardProps) {
  return (
    <Link
      href={href}
      className="group flex w-full items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-pink-500/60 hover:shadow-lg hover:shadow-pink-600/20"
    >
      <span
        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-2xl shadow-inner ${iconBg}`}
      >
        {icon}
      </span>
      <span className="flex flex-col text-left">
        <span className="text-lg font-bold text-zinc-50 transition-colors group-hover:text-pink-400">
          {title}
        </span>
        <span className="text-sm text-zinc-400">{description}</span>
      </span>
    </Link>
  );
}
