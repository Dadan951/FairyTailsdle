"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["fr", "en"];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, ui } = useLanguage();

  const modes = [
    { href: "/classic", label: ui.classicModeTitle },
    { href: "/image", label: ui.imageModeTitle },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-pink-400 transition-colors hover:text-pink-300"
        >
          FairyTailsdle
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/80 p-1">
          {modes.map((mode) => {
            const active = pathname === mode.href;
            return (
              <Link
                key={mode.href}
                href={mode.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow-md shadow-pink-600/30"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {mode.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-1 rounded-full border border-zinc-700 bg-zinc-900/80 p-1">
          {LANGS.map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                lang === code
                  ? "bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
