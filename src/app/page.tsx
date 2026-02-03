"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { StatsCards } from "@/components/StatsCards";
import { ForecastSection } from "@/components/ForecastSection";
import { Footer } from "@/components/Footer";
import { WeatherIconComponent } from "@/lib/weather-codes";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import { useWeatherConditions } from "@/hooks/useWeatherConditions";
import { celsiusToFahrenheit } from "@/lib/utils";
import {
  fadeSlideVariants,
  crossfadeVariants,
  pageTransitionVariants,
} from "@/lib/motion-variants";
import type { TemperatureUnit } from "@/types/weather";

interface WeatherData {
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windUnit?: "mph" | "kmh";
  weatherCode: number;
  dailyForecast: Array<{
    date: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
  }>;
}

function getErrorMessage(
  data: { errorCode?: string } | null,
  t: (k: string) => string
): string {
  if (!data?.errorCode) return t("errorDefault");
  if (data.errorCode === "CITY_NOT_FOUND") return t("errorCityNotFound");
  if (data.errorCode === "FETCH_FAILED") return t("errorFetchFailed");
  return t("errorDefault");
}

type AppState = "empty" | "loading" | "success" | "error";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [unit, setUnit] = useState<TemperatureUnit>("celsius");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [state, setState] = useState<AppState>("empty");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Store only coordinates as source of truth
  const coordinatesRef = useRef<{ lat: number; lon: number } | null>(null);

  const { langCode } = useLanguage();
  const { t } = useTranslations();
  const { getCondition } = useWeatherConditions(langCode);
  const { recentSearches, addRecentSearch } = useRecentSearches(langCode);

  const fetchWeather = useCallback(
    async (city: string, silent = false) => {
      if (!city.trim()) return;

      if (!silent) {
        setState("loading");
        setErrorMessage(null);
      }

      try {
        const res = await fetch(
          `/api/weather?city=${encodeURIComponent(city)}&language=${encodeURIComponent(langCode)}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!silent) {
            throw new Error(getErrorMessage(data, t));
          }
          return;
        }

        const data = await res.json();
        setWeatherData(data);
        if (!silent) {
          setState("success");
        }

        // Store coordinates as source of truth
        if (data.latitude != null && data.longitude != null) {
          coordinatesRef.current = { lat: data.latitude, lon: data.longitude };
          addRecentSearch({
            name: data.city,
            country: data.country,
            lat: data.latitude,
            lon: data.longitude,
          });
        }
      } catch (err) {
        if (!silent) {
          setState("error");
          setErrorMessage(err instanceof Error ? err.message : t("errorDefault"));
          setWeatherData(null);
        }
      }
    },
    [addRecentSearch, t, langCode]
  );

  const fetchByCoordinates = useCallback(
    async (lat: number, lon: number, silent = false) => {
      if (!silent) {
        setState("loading");
        setErrorMessage(null);
      }

      try {
        const res = await fetch(
          `/api/geolocation?lat=${lat}&lon=${lon}&language=${encodeURIComponent(langCode)}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!silent) {
            throw new Error(getErrorMessage(data, t));
          }
          return;
        }

        const data = await res.json();
        setWeatherData(data);
        if (!silent) {
          setState("success");
        }
        // Store coordinates as source of truth
        coordinatesRef.current = { lat, lon };
      } catch (err) {
        if (!silent) {
          setState("error");
          setErrorMessage(err instanceof Error ? err.message : t("errorDefault"));
          setWeatherData(null);
        }
      }
    },
    [t, langCode]
  );

  const fetchByGeolocation = useCallback(async () => {
    if (!navigator.geolocation) return;

    setState("loading");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Store coordinates immediately as source of truth
          coordinatesRef.current = { lat: latitude, lon: longitude };
          
          const res = await fetch(
            `/api/geolocation?lat=${latitude}&lon=${longitude}&language=${encodeURIComponent(langCode)}`
          );

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(getErrorMessage(data, t));
          }

          const data = await res.json();
          setWeatherData(data);
          setState("success");
        } catch (err) {
          setState("error");
          setErrorMessage(err instanceof Error ? err.message : t("errorDefault"));
          setWeatherData(null);
        }
      },
      () => {
        setState("empty");
      }
    );
  }, [t, langCode]);

  useEffect(() => {
    fetchByGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track previous langCode to detect changes
  const prevLangCodeRef = useRef<string | null>(null);

  // Silently refetch weather data when language changes using coordinates
  useEffect(() => {
    // Skip on initial mount
    if (prevLangCodeRef.current === null) {
      prevLangCodeRef.current = langCode;
      return;
    }

    // Refetch using coordinates when language changes
    if (prevLangCodeRef.current !== langCode && coordinatesRef.current && weatherData) {
      const { lat, lon } = coordinatesRef.current;
      fetchByCoordinates(lat, lon, true);
    }

    prevLangCodeRef.current = langCode;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langCode]);

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    fetchWeather(query);
    setSearchQuery("");
  };

  const handleSelectSuggestion = (city: string) => {
    fetchWeather(city);
    setSearchQuery("");
  };

  const handleSelectRecentSearch = (item: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }) => {
    addRecentSearch(item);
    fetchByCoordinates(item.lat, item.lon);
    setSearchQuery("");
  };

  const handleUnitChange = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
  };

  const tempSuffix = unit === "fahrenheit" ? "°F" : "°C";

  return (
    <div className="flex min-h-[800px] flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[1298px] flex-1 flex-col">
        <Header unit={unit} onUnitChange={handleUnitChange} />

        <main className="flex flex-1 flex-col px-6 pt-1 pb-5 md:px-20 lg:px-40">
          <div className="mx-auto flex w-full max-w-[960px] flex-col">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              onSelectSuggestion={handleSelectSuggestion}
              recentSearches={recentSearches}
              onSelectRecentSearch={handleSelectRecentSearch}
              language={langCode}
              disabled={state === "loading"}
            />

            {state === "empty" && (
              <div className="mt-4 flex flex-col items-center justify-center gap-4 py-16 text-center">
                <p className="text-lg text-muted">{t("emptyState")}</p>
              </div>
            )}

            {state === "loading" && (
              <div className="mt-4 flex flex-col items-center justify-center gap-4 py-16">
                <div
                  className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-white"
                  role="status"
                  aria-label={t("loadingAria")}
                />
                <p className="text-muted">{t("loadingWeather")}</p>
              </div>
            )}

            {state === "error" && (
              <div className="mt-4 rounded-card border border-red-500/50 bg-red-500/10 px-4 py-4 text-center" role="alert">
                <p className="font-medium text-red-400">
                  {errorMessage ?? t("errorDefault")}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {t("errorTryAnother")}
                </p>
              </div>
            )}

            {state === "success" && weatherData && (
              <div className="flex flex-col">
                {/* Frame 1: City name only */}
                <div className="flex h-[76px] max-w-[960px] grow-0 flex-col items-center self-stretch pt-6 px-4 pb-3">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.h1
                      key={`city-${coordinatesRef.current?.lat}-${coordinatesRef.current?.lon}-${langCode}`}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={shouldReduceMotion ? {} : fadeSlideVariants}
                      className="text-center text-2xl font-bold text-white md:text-3xl"
                    >
                      {(weatherData.city === "Unknown"
                        ? t("unknownPlace")
                        : weatherData.city)}
                      ,{" "}
                      {(weatherData.country === "Unknown"
                        ? t("unknownPlace")
                        : weatherData.country)}
                    </motion.h1>
                  </AnimatePresence>
                </div>

                {/* Frame 2: Weather description + icon */}
                <div className="flex h-[68px] max-w-[960px] grow-0 flex-row items-center justify-center self-stretch gap-[21px] pt-1 px-4 pb-3">
                  <WeatherIconComponent
                    code={weatherData.weatherCode}
                    size={40}
                    className="shrink-0"
                    alt={getCondition(weatherData.weatherCode).condition}
                  />
                  <p className="text-base leading-6 text-white">
                    {getCondition(weatherData.weatherCode).condition}{" "}
                    {t("withHighOf")}{" "}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={unit}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={shouldReduceMotion ? {} : crossfadeVariants}
                        className="inline-block"
                      >
                        {Math.round(
                          unit === "fahrenheit"
                            ? celsiusToFahrenheit(
                                Math.max(
                                  ...weatherData.dailyForecast.map(
                                    (d) => d.tempMax
                                  )
                                )
                              )
                            : Math.max(
                                ...weatherData.dailyForecast.map(
                                  (d) => d.tempMax
                                )
                              )
                        )}
                        {tempSuffix}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                </div>
              </div>
            )}

            {/* Content below Frame 1 */}
            {state === "success" && weatherData && (
              <>
                <div className="mt-3">
                  <StatsCards
                    humidity={weatherData.humidity}
                    windSpeed={weatherData.windSpeed}
                    feelsLike={weatherData.apparentTemperature}
                    unit={unit}
                  />
                </div>

                <div className="mt-3">
                  <ForecastSection
                    forecast={weatherData.dailyForecast}
                    unit={unit}
                    langCode={langCode}
                  />
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
