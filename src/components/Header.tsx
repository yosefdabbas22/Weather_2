"use client";

import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import logoIcon from "./icons/img/Attached_image.png";
import thermometerIcon from "./icons/img/Thermommeter.png";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
  unit: "celsius" | "fahrenheit";
  onUnitChange: (unit: "celsius" | "fahrenheit") => void;
}

export function Header({ unit, onUnitChange }: HeaderProps) {
  const { t } = useTranslations();
  const { languages, setLanguage, langCode } = useLanguage();

  const toggleUnit = () => {
    onUnitChange(unit === "celsius" ? "fahrenheit" : "celsius");
  };

  return (
    <header
      className="flex h-[48px] w-full max-w-[1298px] shrink-0 flex-row items-center justify-between border-b border-transparent px-[40px] py-3"
      style={{
        borderBottomColor: "rgba(230, 232, 235, 0.2)",
        boxSizing: "border-box",
      }}
    >
      <div className="flex items-center gap-2">
        <Image
          src={logoIcon}
          alt=""
          width={16}
          height={16}
          className="shrink-0"
          style={{ filter: "brightness(0) invert(1)" }}
          aria-hidden
        />
        <span
          className="shrink-0 font-semibold text-white"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "20px",
            color: "#FFFFFF",
          }}
        >
          {t("appTitle")}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <select
            value={langCode}
            onChange={(e) => setLanguage(e.target.value)}
            className="cursor-pointer appearance-none border-0 bg-transparent pr-5 text-white focus:outline-none focus:ring-0"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              fontSize: "13px",
              lineHeight: "18px",
            }}
            aria-label={t("selectLanguage")}
          >
            {languages.map((lang: Language) => (
              <option key={lang.code} value={lang.code} className="bg-[#1A222A] text-white">
                {lang.native}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            strokeWidth={2}
            className="pointer-events-none absolute right-0 shrink-0 text-white"
            aria-hidden
          />
        </div>
        <button
          type="button"
          onClick={toggleUnit}
          className="flex cursor-pointer items-center justify-center gap-1.5 border-0 bg-transparent p-0 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "23px",
          }}
        aria-pressed={unit === "celsius"}
        aria-label={unit === "celsius" ? t("toggleToFahrenheit") : t("toggleToCelsius")}
      >
        <span>{unit === "celsius" ? "°C" : "°F"}</span>
        <Image
          src={thermometerIcon}
          alt=""
          width={35}
          height={18}
          loading="lazy"
          decoding="async"
          className="shrink-0"
          style={{ color: "transparent", filter: "brightness(0) invert(1)" }}
          aria-hidden
        />
      </button>
      </div>
    </header>
  );
}
