"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface Suggestion {
  name: string;
  country: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useSearchSuggestions(
  query: string,
  language: string,
  debounceMs = 400
) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debouncedQuery = useDebounce(query.trim(), debounceMs);

  const fetchSuggestions = useCallback(async (q: string, lang: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(q)}&language=${encodeURIComponent(lang)}`,
        { signal: abortRef.current.signal }
      );
      const data = await res.json();
      setSuggestions(data.results ?? []);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchSuggestions(debouncedQuery, language);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, language, fetchSuggestions]);

  return { suggestions, isLoading };
}
