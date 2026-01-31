"use client";

import { useTranslations } from "@/hooks/useTranslations";

export function Footer() {
  const { t } = useTranslations();

  return (
    <footer className="flex h-[104px] flex-shrink-0 items-center justify-center">
      <p className="text-center text-muted">
        {t("footerCopyright")}
      </p>
    </footer>
  );
}
