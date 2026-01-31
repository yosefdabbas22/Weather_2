"use client";

import { useState, useEffect, useCallback } from "react";

export interface WeatherConditionEntry {
  label: string;
  condition: string;
}

type WeatherConditionsMap = Record<string, WeatherConditionEntry>;

const cache = new Map<string, WeatherConditionsMap>();

async function loadWeatherConditions(lang: string): Promise<WeatherConditionsMap> {
  const cached = cache.get(lang);
  if (cached) return cached;

  try {
    const mod = await import(`@/lib/weather-conditions/${lang}.json`);
    const data = mod.default as WeatherConditionsMap;
    cache.set(lang, data);
    return data;
  } catch {
    if (lang !== "en") {
      return loadWeatherConditions("en");
    }
    return {};
  }
}

export function useWeatherConditions(langCode: string) {
  const [conditions, setConditions] = useState<WeatherConditionsMap>({});

  useEffect(() => {
    loadWeatherConditions(langCode).then(setConditions);
  }, [langCode]);

  const getCondition = useCallback(
    (weatherCode: number): { label: string; condition: string } => {
      const key = String(weatherCode);
      const entry = conditions[key];
      if (entry) return entry;
      if (langCode !== "en") {
        const enCached = cache.get("en");
        const enEntry = enCached?.[key];
        if (enEntry) return enEntry;
      }
      return { label: "Unknown", condition: "Unknown conditions" };
    },
    [conditions, langCode]
  );

  return { getCondition };
}
