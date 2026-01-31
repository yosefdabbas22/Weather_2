"use client";

import { useTranslations } from "@/hooks/useTranslations";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
}

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="flex h-[142px] min-w-[158px] max-w-[298.67px] flex-1 flex-col items-start justify-start gap-2 rounded-[12px] bg-[#26303B] p-6">
      <p className="font-sans text-[16px] font-medium leading-[24px] text-[#FFFFFF]">
        {title}
      </p>
      <p className="font-sans text-[24px] font-bold leading-[30px] text-[#FFFFFF]">
        {value}
      </p>
      <p className="font-sans text-[16px] font-medium leading-[24px] text-[#99ABBD]">
        {subtitle}
      </p>
    </div>
  );
}

interface StatsCardsProps {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  unit: "celsius" | "fahrenheit";
  windUnit?: "mph" | "kmh";
}

export function StatsCards({ humidity, windSpeed, feelsLike, unit, windUnit = "mph" }: StatsCardsProps) {
  const { t } = useTranslations();
  const tempSuffix = unit === "fahrenheit" ? "°F" : "°C";
  const windLabel = windUnit === "mph" ? "mph" : "km/h";

  return (
    <div className="flex w-full flex-wrap items-start gap-4 sm:flex-row">
      <StatCard
        title={t("humidity")}
        value={`${humidity}%`}
        subtitle={t("cloud")}
      />
      <StatCard
        title={t("wind")}
        value={`${windSpeed} ${windLabel}`}
        subtitle={t("wind")}
      />
      <StatCard
        title={t("feelsLike")}
        value={`${Math.round(feelsLike)}${tempSuffix}`}
        subtitle={t("thermometer")}
      />
    </div>
  );
}
