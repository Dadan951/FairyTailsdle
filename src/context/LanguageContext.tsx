"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lang, UI_TEXT } from "@/lib/i18n";

const STORAGE_KEY = "ftdle-lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  ui: (typeof UI_TEXT)[Lang];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture ponctuelle de la préférence en localStorage (indisponible côté serveur).
      setLangState(stored);
    }
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, ui: UI_TEXT[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
