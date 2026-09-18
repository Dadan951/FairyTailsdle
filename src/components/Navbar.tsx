"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["fr", "en"];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, ui } = useLanguage();
  const [open, setOpen] = useState(false);

  const modes = [
    { href: "/classic", label: ui.classicModeTitle },
    { href: "/image", label: ui.imageModeTitle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            aria-label="Menu"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors hover:bg-zinc-800"
          >
            <span className="h-0.5 w-5 rounded-full bg-zinc-200" />
            <span className="h-0.5 w-5 rounded-full bg-zinc-200" />
            <span className="h-0.5 w-5 rounded-full bg-zinc-200" />
          </button>

          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-pink-400 transition-colors hover:text-pink-300"
          >
            FairyTailsdle
          </Link>

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

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-1 border-r border-zinc-800 bg-zinc-950 p-4 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight text-pink-400">FairyTailsdle</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            ✕
          </button>
        </div>

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
            pathname === "/" ? "bg-zinc-800 text-pink-400" : "text-zinc-300 hover:bg-zinc-900"
          }`}
        >
          {ui.homeTitle}
        </Link>

        {modes.map((mode) => {
          const active = pathname === mode.href;
          return (
            <Link
              key={mode.href}
              href={mode.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white shadow-md shadow-pink-600/30"
                  : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {mode.label}
            </Link>
          );
        })}
      </aside>
    </>
  );
}
