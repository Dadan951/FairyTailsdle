"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { ui } = useLanguage();

  return (
    <footer className="relative z-10 mt-auto border-t border-zinc-800/80 bg-zinc-950/70 px-4 py-6 text-center backdrop-blur-md">
      <p className="mx-auto max-w-md text-sm text-zinc-400">{ui.footerAbout}</p>
      <p className="mt-2 text-xs font-semibold text-pink-400">{ui.footerCredit}</p>
    </footer>
  );
}
