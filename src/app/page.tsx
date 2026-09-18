"use client";

import { useLanguage } from "@/context/LanguageContext";
import ModeCard from "@/components/ModeCard";

export default function HomePage() {
  const { ui } = useLanguage();

  return (
    <div className="relative flex min-h-screen flex-col items-center gap-8 px-4 py-16 text-zinc-50">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-pink-400 drop-shadow-[0_2px_12px_rgba(236,72,153,0.5)]">
          {ui.homeTitle}
        </h1>
        <p className="text-zinc-300">{ui.homeSubtitle}</p>
      </header>

      <div className="flex w-full max-w-md flex-col gap-4">
        <ModeCard href="/classic" title={ui.classicModeTitle} description={ui.classicModeDesc} />
        <ModeCard href="/image" title={ui.imageModeTitle} description={ui.imageModeDesc} />
      </div>
    </div>
  );
}
