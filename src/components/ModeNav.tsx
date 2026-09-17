"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MODES = [
  { href: "/", label: "Classic" },
  { href: "/silhouette", label: "Silhouette" },
];

export default function ModeNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 rounded-full border border-zinc-800 bg-zinc-900 p-1">
      {MODES.map((mode) => {
        const active = pathname === mode.href;
        return (
          <Link
            key={mode.href}
            href={mode.href}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              active ? "bg-pink-600 text-white" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {mode.label}
          </Link>
        );
      })}
    </nav>
  );
}
