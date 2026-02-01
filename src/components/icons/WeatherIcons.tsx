"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

import sunnyImg from "./img/sunny.png";
import partlyCloudyImg from "./img/partly-cloudy.png";
import rainyImg from "./img/rainy.png";
import snowImg from "./img/SnowCloud.png";
import thunderstormImg from "./img/ThundweStorm.png";

const ICON_IMAGES: Record<string, { src: typeof sunnyImg; alt: string }> = {
  sunny: { src: sunnyImg, alt: "Sunny" },
  "partly-cloudy": { src: partlyCloudyImg, alt: "Partly cloudy" },
  cloudy: { src: partlyCloudyImg, alt: "Cloudy" },
  rainy: { src: rainyImg, alt: "Rainy" },
  thunderstorm: { src: thunderstormImg, alt: "Thunderstorm" },
  fog: { src: partlyCloudyImg, alt: "Fog" },
  snow: { src: snowImg, alt: "Snow" },
};

const FIGMA_CONTAINER = 72;
const FIGMA_VISUAL = 40;
const FIGMA_PADDING_Y = 8;
const FIGMA_PADDING_X = 16;

export type WeatherIconVariant =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "rainy"
  | "thunderstorm"
  | "fog"
  | "snow";

interface WeatherIconProps {
  variant: WeatherIconVariant;
  size?: number;
  className?: string;
  alt?: string;
}

export function WeatherIcon({
  variant,
  size = FIGMA_CONTAINER,
  className,
  alt: altProp,
}: WeatherIconProps) {
  const img = ICON_IMAGES[variant] ?? ICON_IMAGES["partly-cloudy"];
  const alt = altProp ?? img.alt;
  const isFigmaSize = size === FIGMA_CONTAINER;
  const containerW = size;
  const containerH = size;
  const visualSize = isFigmaSize ? FIGMA_VISUAL : size;
  const paddingStyle = isFigmaSize
    ? { padding: `${FIGMA_PADDING_Y}px ${FIGMA_PADDING_X}px` }
    : undefined;
  const isThunderstorm = variant === "thunderstorm";

  const containerStyle: React.CSSProperties = {
    width: containerW,
    height: containerH,
    ...paddingStyle,
    ...(isThunderstorm && {
      background: "transparent",
      boxShadow: "none",
      border: "none",
    }),
  };

  const imageStyle: React.CSSProperties = {
    width: visualSize,
    height: visualSize,
    ...(isThunderstorm && {
      boxShadow: "none",
      mixBlendMode: "lighten",
    }),
  };

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden",
        isThunderstorm && "shadow-none",
        className
      )}
      style={containerStyle}
      aria-hidden
    >
      <Image
        src={img.src}
        alt={alt}
        width={visualSize}
        height={visualSize}
        className={cn("object-contain", isThunderstorm && "shadow-none")}
        style={imageStyle}
      />
    </span>
  );
}
