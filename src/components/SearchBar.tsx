"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { RecentSearch } from "@/hooks/useRecentSearches";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { useTranslations } from "@/hooks/useTranslations";

function HighlightMatch({ text, query }: { text?: string | null; query?: string | null }) {
  if (text == null || typeof text !== "string") return null;
  const q = typeof query === "string" ? query.trim() : "";
  if (!q) return <>{text}</>;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-white/20 font-medium text-white">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelectSuggestion?: (city: string) => void;
  recentSearches?: RecentSearch[];
  onSelectRecentSearch?: (item: RecentSearch) => void;
  language: string;
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onSelectSuggestion,
  recentSearches = [],
  onSelectRecentSearch,
  language,
  placeholder,
  disabled = false,
  "aria-label": ariaLabel,
}: SearchBarProps) {
  const { t } = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const { suggestions, isLoading } = useSearchSuggestions(value, language, 400);

  useEffect(() => {
    if (value.trim().length >= 2) {
      setIsOpen(true);
      setShowRecent(false);
    } else {
      setIsOpen(false);
    }
  }, [value]);

  const handleFocus = useCallback(() => {
    if (value.trim().length >= 2) {
      setIsOpen(true);
    } else if (recentSearches.length > 0) {
      setShowRecent(true);
    }
  }, [value, recentSearches.length]);

  const handleChange = useCallback(
    (v: string) => {
      onChange(v);
      if (v.trim().length > 0) setShowRecent(false);
    },
    [onChange]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowRecent(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    onSubmit();
  };

  const handleSelect = (suggestion: { name?: string; country?: string }) => {
    const name = suggestion?.name ?? "";
    const country = suggestion?.country ?? "";
    const display = [name, country].filter(Boolean).join(", ");
    onChange(display);
    setIsOpen(false);
    setShowRecent(false);
    if (onSelectSuggestion) {
      onSelectSuggestion(display);
    } else {
      onSubmit();
    }
  };

  const handleRecentSelect = (item: RecentSearch) => {
    const name = item?.name ?? "";
    const country = item?.country ?? "";
    onChange([name, country].filter(Boolean).join(", ") || "");
    setIsOpen(false);
    setShowRecent(false);
    onSelectRecentSearch?.(item);
  };

  const showDropdown = isOpen && value.trim().length >= 2;
  const showRecentSearches = showRecent && value.trim().length === 0 && recentSearches.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex h-[72px] items-center gap-3 rounded-card bg-card px-4 py-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 text-muted"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder ?? t("searchPlaceholder")}
            disabled={disabled}
            aria-label={ariaLabel ?? t("searchAriaLabel")}
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="search-suggestions-list"
            className="flex-1 bg-transparent text-base text-white placeholder:text-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
      </form>

      {showRecentSearches && (
        <ul
          id="recent-searches-list"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[280px] overflow-auto rounded-lg border border-[#384757] bg-[#1A222A] py-1"
        >
          {recentSearches.map((item, i) => (
            <li
              key={`${item.name}-${item.country}-${i}`}
              role="option"
              tabIndex={0}
              className="cursor-pointer px-4 py-3 text-left transition-colors hover:bg-[#26303B] rtl:text-right"
              onMouseDown={(e) => {
                e.preventDefault();
                handleRecentSelect(item);
              }}
            >
              <span className="text-[#FFFFFF]">{item.name}</span>
              <span className="ml-1 text-[#99ABBD] rtl:ml-0 rtl:mr-1">, {item.country}</span>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && (
        <ul
          id="search-suggestions-list"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[280px] overflow-auto rounded-lg border border-[#384757] bg-[#1A222A] py-1"
        >
          {isLoading ? (
            <li className="px-4 py-3 text-[#99ABBD]" role="option">
              {t("loading")}
            </li>
          ) : suggestions.length === 0 ? (
            <li className="px-4 py-3 text-[#99ABBD]" role="option">
              {t("noResults")}
            </li>
          ) : (
            suggestions.map((s, i) => {
              const name = s?.name ?? "";
              const country = s?.country ?? "";
              return (
                <li
                  key={`${name}-${country}-${i}`}
                  role="option"
                  tabIndex={0}
                  className="cursor-pointer px-4 py-3 text-left transition-colors hover:bg-[#26303B] rtl:text-right"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(s);
                  }}
                >
                  <span className="text-[#FFFFFF]">
                    <HighlightMatch text={name} query={value?.trim?.() ?? ""} />
                  </span>
                  <span className="ml-1 text-[#99ABBD] rtl:ml-0 rtl:mr-1">
                    , <HighlightMatch text={country} query={value?.trim?.() ?? ""} />
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
