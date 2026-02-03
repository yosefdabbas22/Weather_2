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
    <div className="w-full max-w-[1298px] shrink-0">
      <header
        className="
          flex
          w-full
          flex-wrap
          items-center
          justify-between
          gap-y-2
          px-4
          py-3

          sm:flex-nowrap
          sm:px-10
        "
      >
        {/* LEFT: Logo + App name */}
        <div className="flex items-center gap-2 whitespace-nowrap">
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
            className="font-semibold text-white"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              fontSize: "16px",
              lineHeight: "20px",
            }}
          >
            {t("appTitle")}
          </span>
        </div>

        {/* RIGHT: Language + Unit */}
        <div className="flex w-full justify-end items-center gap-2 whitespace-nowrap sm:w-auto">
          <div className="relative flex items-center">
            <select
              value={langCode}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-transparent pr-6 text-white outline-none"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "18px",
              }}
              aria-label={t("selectLanguage")}
            >
              {languages.map((lang: Language) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="bg-[#1A222A] text-white"
                >
                  {lang.native}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              strokeWidth={2}
              className="pointer-events-none absolute right-0 text-white"
              aria-hidden
            />
          </div>

          <button
            type="button"
            onClick={toggleUnit}
            className="flex items-center gap-1.5 bg-transparent text-white focus:outline-none"
            aria-pressed={unit === "celsius"}
            aria-label={
              unit === "celsius"
                ? t("toggleToFahrenheit")
                : t("toggleToCelsius")
            }
          >
            <span>{unit === "celsius" ? "°C" : "°F"}</span>
            <Image
              src={thermometerIcon}
              alt=""
              width={35}
              height={18}
              className="shrink-0"
              style={{ filter: "brightness(0) invert(1)" }}
              aria-hidden
            />
          </button>
        </div>
      </header>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{ backgroundColor: "rgba(230, 232, 235, 0.2)" }}
        aria-hidden
      />
    </div>
  );
}
