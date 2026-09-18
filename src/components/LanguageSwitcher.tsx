"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Lang } from "@/lib/i18n";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed top-3 right-3 z-30 flex gap-1 rounded-full border border-zinc-700 bg-zinc-900/80 p-1 backdrop-blur">
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLang(opt.code)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
            lang === opt.code
              ? "bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
