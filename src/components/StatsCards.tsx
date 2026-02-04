"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";
import { celsiusToFahrenheit, kmhToMph, cn } from "@/lib/utils";
import {
  staggerContainerVariants,
  fadeUpVariants,
} from "@/lib/motion-variants";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  center?: boolean;
}

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div
      className="
        flex
        h-[142px]
        w-full
        flex-col
        justify-center
        gap-2
        rounded-[12px]
        bg-[#26303B]
        p-6
        text-center

        lg:max-w-[298.67px]
        lg:justify-start
        lg:text-left
      "
    >
      {/* Title */}
      <div className="flex flex-col">
        <p className="text-[16px] font-medium text-white">{title}</p>
      </div>

      {/* Value */}
      <div className="flex flex-col">
        <p className="text-[24px] font-bold text-white">{value}</p>
      </div>

      {/* Subtitle */}
      <div className="flex flex-col">
        <p className="text-[16px] font-medium text-[#99ABBD]">{subtitle}</p>
      </div>
    </div>
  );
}



interface StatsCardsProps {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  unit: "celsius" | "fahrenheit";
}

export function StatsCards({ humidity, windSpeed, feelsLike, unit }: StatsCardsProps) {
  const { t } = useTranslations();
  const shouldReduceMotion = useReducedMotion();

  const tempSuffix = unit === "fahrenheit" ? "°F" : "°C";
  const windLabel = unit === "fahrenheit" ? "mph" : "km/h";

  const displayFeelsLike =
    unit === "fahrenheit" ? celsiusToFahrenheit(feelsLike) : feelsLike;

  const displayWindSpeed =
    unit === "fahrenheit" ? kmhToMph(windSpeed) : windSpeed;

  return (
    <motion.div
      className="grid w-full grid-cols-2 gap-4 lg:grid-cols-3"
      variants={shouldReduceMotion ? {} : staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpVariants}>
        <StatCard
          title={t("humidity")}
          value={`${humidity}%`}
          subtitle={t("cloud")}
        />
      </motion.div>

      <motion.div variants={fadeUpVariants}>
        <StatCard
          title={t("wind")}
          value={`${Math.round(displayWindSpeed)} ${windLabel}`}
          subtitle={t("wind")}
        />
      </motion.div>

      <motion.div className="col-span-2 w-[calc((100%-1rem)/2)] mx-auto lg:col-span-1 lg:w-full lg:mx-0" variants={fadeUpVariants}>
        <StatCard
          title={t("feelsLike")}
          value={`${Math.round(displayFeelsLike)}${tempSuffix}`}
          subtitle={t("thermometer")}
        />
      </motion.div>
    </motion.div>
  );
}

