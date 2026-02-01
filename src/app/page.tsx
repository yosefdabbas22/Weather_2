"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import type { TemperatureUnit } from "@/types/weather";

interface WeatherData {
  city: string;
  country: string;
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

function getErrorMessage(data: { errorCode?: string } | null, t: (k: string) => string): string {
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
  const lastFetchedRef = useRef<{ type: "city" | "geo" | "coordinates"; city?: string; lat?: number; lon?: number } | null>(null);
  const { langCode } = useLanguage();
  const { t } = useTranslations();
  const { getCondition } = useWeatherConditions(langCode);
  const { recentSearches, addRecentSearch } = useRecentSearches(langCode);

  const fetchWeather = useCallback(
    async (city: string) => {
      if (!city.trim()) return;

      setState("loading");
      setErrorMessage(null);

      try {
        const res = await fetch(
          `/api/weather?city=${encodeURIComponent(city)}&language=${encodeURIComponent(langCode)}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(getErrorMessage(data, t));
        }

        const data = await res.json();
        setWeatherData(data);
        setState("success");
        if (data.latitude != null && data.longitude != null) {
          addRecentSearch({
            name: data.city,
            country: data.country,
            lat: data.latitude,
            lon: data.longitude,
          });
        }
      } catch (err) {
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : t("errorDefault"));
        setWeatherData(null);
      }
    },
    [addRecentSearch, t, langCode]
  );

  const fetchByCoordinates = useCallback(
    async (lat: number, lon: number) => {
      setState("loading");
      setErrorMessage(null);

      try {
        const res = await fetch(
          `/api/geolocation?lat=${lat}&lon=${lon}&language=${encodeURIComponent(langCode)}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(getErrorMessage(data, t));
        }

        const data = await res.json();
        setWeatherData(data);
        setState("success");
        lastFetchedRef.current = { type: "coordinates", lat, lon };
      } catch (err) {
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : t("errorDefault"));
        setWeatherData(null);
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
    lastFetchedRef.current = { type: "geo" };
    fetchByGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (langCode && state === "success" && weatherData && lastFetchedRef.current) {
      const ref = lastFetchedRef.current;
      if (ref.type === "city" && ref.city) {
        fetchWeather(ref.city);
      } else if (ref.type === "coordinates" && ref.lat != null && ref.lon != null) {
        fetchByCoordinates(ref.lat, ref.lon);
      } else {
        fetchByGeolocation();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langCode]);

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    lastFetchedRef.current = { type: "city", city: query };
    fetchWeather(query);
    setSearchQuery("");
  };

  const handleSelectSuggestion = (city: string) => {
    lastFetchedRef.current = { type: "city", city };
    fetchWeather(city);
    setSearchQuery("");
  };

  const handleSelectRecentSearch = (item: { name: string; country: string; lat: number; lon: number }) => {
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

        <main className="flex flex-1 flex-col px-6 py-5 md:px-20 lg:px-40">
          <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6">
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
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <p className="text-lg text-muted">
                  {t("emptyState")}
                </p>
              </div>
            )}

            {state === "loading" && (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <div
                  className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-white"
                  role="status"
                  aria-label={t("loadingAria")}
                />
                <p className="text-muted">{t("loadingWeather")}</p>
              </div>
            )}

            {state === "error" && (
              <div
                className="rounded-card border border-red-500/50 bg-red-500/10 px-4 py-4 text-center"
                role="alert"
              >
                <p className="font-medium text-red-400">
                  {errorMessage ?? t("errorDefault")}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {t("errorTryAnother")}
                </p>
              </div>
            )}

            {state === "success" && weatherData && (
              <>
                <h1 className="text-center text-2xl font-bold text-white md:text-3xl">
                  {(weatherData.city === "Unknown" ? t("unknownPlace") : weatherData.city)}, {(weatherData.country === "Unknown" ? t("unknownPlace") : weatherData.country)}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                  <WeatherIconComponent
                    code={weatherData.weatherCode}
                    size={40}
                    className="shrink-0"
                    alt={getCondition(weatherData.weatherCode).condition}
                  />
                  <p className="text-base leading-6 text-white">
                    {getCondition(weatherData.weatherCode).condition} {t("withHighOf")}{" "}
                    {Math.round(
                      unit === "fahrenheit"
                        ? celsiusToFahrenheit(Math.max(...weatherData.dailyForecast.map((d) => d.tempMax)))
                        : Math.max(...weatherData.dailyForecast.map((d) => d.tempMax))
                    )}
                    {tempSuffix}
                  </p>
                </div>

                <StatsCards
                  humidity={weatherData.humidity}
                  windSpeed={weatherData.windSpeed}
                  feelsLike={weatherData.apparentTemperature}
                  unit={unit}
                  windUnit={weatherData.windUnit}
                />

                <ForecastSection
                  forecast={weatherData.dailyForecast}
                  unit={unit}
                  langCode={langCode}
                />
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
