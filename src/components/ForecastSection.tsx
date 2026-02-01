"use client";

import { WeatherIconComponent } from "@/lib/weather-codes";
import { useTranslations } from "@/hooks/useTranslations";
import { useWeatherConditions } from "@/hooks/useWeatherConditions";
import { celsiusToFahrenheit } from "@/lib/utils";

interface ForecastDay {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

interface ForecastSectionProps {
  forecast: ForecastDay[];
  unit: "celsius" | "fahrenheit";
  langCode: string;
}

function formatDayName(dateStr: string, langCode: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return new Intl.DateTimeFormat(langCode, { weekday: "long" }).format(date);
}

export function ForecastSection({ forecast, unit, langCode }: ForecastSectionProps) {
  const { t } = useTranslations();
  const { getCondition } = useWeatherConditions(langCode);
  const tempSuffix = unit === "fahrenheit" ? "°F" : "°C";

  // Skip today (index 0); show next 5 future days starting from tomorrow
  const futureDays = forecast.slice(1, 6);

  const forecastWithLocalized = futureDays.map((day) => ({
    ...day,
    dayName: formatDayName(day.date, langCode),
    condition: getCondition(day.weatherCode).label,
    displayTempMax: unit === "fahrenheit" ? celsiusToFahrenheit(day.tempMax) : day.tempMax,
    displayTempMin: unit === "fahrenheit" ? celsiusToFahrenheit(day.tempMin) : day.tempMin,
  }));

  return (
    <section className="w-full" aria-labelledby="forecast-title">
      <h2 id="forecast-title" className="mb-5 text-[22px] font-bold text-white">
        {t("forecastTitle")}
      </h2>
      <div className="overflow-hidden rounded-[12px] border border-[#384757] bg-transparent">
        <div className="grid h-[46px] min-h-[46px] grid-cols-[1.2fr_1fr_1fr_72px] items-center gap-4 border-b border-[#384757] bg-[#1C2129] px-4 text-[14px] font-medium text-white">
          <span>{t("day")}</span>
          <span>{t("highLow")}</span>
          <span>{t("condition")}</span>
          <span className="sr-only">{t("weatherIconAria")}</span>
        </div>
        {forecastWithLocalized.map((day) => (
          <div
            key={day.date}
            className="grid h-[72px] min-h-[72px] grid-cols-[1.2fr_1fr_1fr_72px] items-center gap-4 border-t border-[#384757] bg-transparent px-4 first:border-t-0"
          >
            <span className="text-[14px] text-white">{day.dayName}</span>
            <span className="text-[14px] text-[#99ABBD]">
              {Math.round(day.displayTempMax)}
              {tempSuffix} / {Math.round(day.displayTempMin)}
              {tempSuffix}
            </span>
            <span className="text-[14px] text-[#99ABBD]">
              {day.condition}
            </span>
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center">
              <WeatherIconComponent code={day.weatherCode} size={72} alt={day.condition} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
