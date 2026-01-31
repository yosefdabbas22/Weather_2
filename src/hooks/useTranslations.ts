"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Translations = Record<string, string>;

const cache = new Map<string, Translations>();

async function loadTranslations(lang: string): Promise<Translations> {
  const cached = cache.get(lang);
  if (cached) return cached;

  try {
    const mod = await import(`@/locales/${lang}.json`);
    const data = mod.default as Translations;
    cache.set(lang, data);
    return data;
  } catch {
    if (lang !== "en") {
      return loadTranslations("en");
    }
    return {};
  }
}

export function useTranslations() {
  const { langCode } = useLanguage();
  const [translations, setTranslations] = useState<Translations>({});
  const [enFallback, setEnFallback] = useState<Translations>({});

  useEffect(() => {
    loadTranslations(langCode).then(setTranslations);
    if (langCode !== "en") {
      loadTranslations("en").then(setEnFallback);
    } else {
      setEnFallback({});
    }
  }, [langCode]);

  const t = useCallback(
    (key: string): string => {
      const value = translations[key] ?? enFallback[key] ?? key;
      if (value === key && langCode !== "en") {
        if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
          console.warn(`[i18n] Missing translation for key "${key}" in language "${langCode}", falling back to English`);
        }
      }
      return value;
    },
    [translations, enFallback, langCode]
  );

  return { t, translations };
}
