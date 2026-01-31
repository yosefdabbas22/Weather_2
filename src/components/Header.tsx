"use client";

import Image from "next/image";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import logoIcon from "./icons/img/Attached_image.png";
import thermometerSunIcon from "./icons/img/ChatGPT Image Jan 30, 2026, 06_06_20 PM.png";

interface HeaderProps {
  unit: "celsius" | "fahrenheit";
  onUnitChange: (unit: "celsius" | "fahrenheit") => void;
}

export function Header({ unit, onUnitChange }: HeaderProps) {
  const { t } = useTranslations();
  const { language, languages, setLanguage, langCode } = useLanguage();

  const toggleUnit = () => {
    onUnitChange(unit === "celsius" ? "fahrenheit" : "celsius");
  };

  return (
    <header
      className="flex h-[48px] w-full shrink-0 flex-row items-center justify-between border-b px-[40px] py-3"
      style={{ borderBottomColor: "rgba(230, 232, 235, 0.2)" }}
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
        <span className="font-semibold text-white">{t("appTitle")}</span>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={langCode}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded border-0 bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label={t("selectLanguage")}
        >
          {languages.map((lang: Language) => (
            <option key={lang.code} value={lang.code} className="bg-[#1A222A] text-white">
              {lang.native}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={toggleUnit}
          className="flex cursor-pointer flex-row items-center gap-2 border-0 bg-transparent p-0 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background"
          aria-label={t("toggleUnitAria")}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center font-sans text-[18px] font-bold leading-none text-[#FFFFFF]">
            {unit === "celsius" ? "°C" : "°F"}
          </span>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden">
            <Image
              src={thermometerSunIcon}
              alt=""
              width={24}
              height={24}
              unoptimized
              className="h-6 w-6 min-w-0 object-contain object-center"
              aria-hidden
            />
          </span>
        </button>
      </div>
    </header>
  );
}
