"use client";

import React,{
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

import languagesData from "@/data/languages.json";

const LANG_STORAGE_KEY = "weather-language";

export interface Language {
  code: string;
  name: string;
  native: string;
  rtl?: number;
}

const LANGUAGES: Language[] = (languagesData as Language[]).filter(
  (lang) => lang.code === "en" || lang.code === "ar"
);

interface LanguageContextValue {
  language: Language;
  langCode: string;
  isRtl: boolean;
  setLanguage: (code: string) => void;
  languages: Language[];
}

const defaultLang = LANGUAGES.find((l) => l.code === "en") ?? LANGUAGES[0];

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLang(): string {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
    }
  } catch {
    // fail silently
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCodeState] = useState("en");

  useEffect(() => {
    setLangCodeState(getStoredLang());
  }, []);

  const setLanguage = useCallback((code: string) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    if (!lang) return;
    setLangCodeState(code);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LANG_STORAGE_KEY, code);
        document.documentElement.lang = code;
        document.documentElement.dir = lang.rtl === 1 ? "rtl" : "ltr";
      }
    } catch {
      // fail silently
    }
  }, []);

  useEffect(() => {
    const lang = LANGUAGES.find((l) => l.code === langCode) ?? defaultLang;
    document.documentElement.lang = langCode;
    document.documentElement.dir = lang.rtl === 1 ? "rtl" : "ltr";
  }, [langCode]);

  const language = LANGUAGES.find((l) => l.code === langCode) ?? defaultLang;
  const isRtl = language.rtl === 1;

  const value: LanguageContextValue = {
    language,
    langCode,
    isRtl,
    setLanguage,
    languages: LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
