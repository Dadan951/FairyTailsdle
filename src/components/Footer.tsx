"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { ui } = useLanguage();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800/80 bg-zinc-950/80 px-4 py-2.5 text-center backdrop-blur-md">
      <p className="text-xs font-semibold text-pink-400">{ui.footerCredit}</p>
    </footer>
  );
}
