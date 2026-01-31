"use client";

import { useState, useCallback, useEffect } from "react";

const MAX_ITEMS = 5;

export interface RecentSearch {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

function getStorageKey(lang: string) {
  return `recentSearches_${lang}`;
}

function readFromStorage(lang: string): RecentSearch[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(getStorageKey(lang)) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is RecentSearch =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as RecentSearch).name === "string" &&
        typeof (x as RecentSearch).country === "string" &&
        typeof (x as RecentSearch).lat === "number" &&
        typeof (x as RecentSearch).lon === "number"
    );
  } catch {
    return [];
  }
}

function writeToStorage(lang: string, items: RecentSearch[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(getStorageKey(lang), JSON.stringify(items));
    }
  } catch {
    // fail silently
  }
}

export function useRecentSearches(lang: string) {
  const [items, setItems] = useState<RecentSearch[]>([]);

  useEffect(() => {
    setItems(readFromStorage(lang));
  }, [lang]);

  const add = useCallback((item: RecentSearch) => {
    const current = readFromStorage(lang);
    const filtered = current.filter(
      (x) => !(x.name === item.name && x.country === item.country)
    );
    const updated = [item, ...filtered].slice(0, MAX_ITEMS);
    writeToStorage(lang, updated);
    setItems(updated);
    return updated;
  }, [lang]);

  return { recentSearches: items, addRecentSearch: add };
}
