import { WeatherIcon, type WeatherIconVariant } from "@/components/icons/WeatherIcons";

export const WMO_WEATHER_CODES: Record<
  number,
  { label: string; condition: string }
> = {
  0: { label: "Clear", condition: "Clear sky" },
  1: { label: "Mainly Clear", condition: "Mainly clear" },
  2: { label: "Partly Cloudy", condition: "Partly cloudy" },
  3: { label: "Overcast", condition: "Overcast" },
  45: { label: "Foggy", condition: "Foggy" },
  48: { label: "Rime Fog", condition: "Depositing rime fog" },
  51: { label: "Light Drizzle", condition: "Light drizzle" },
  53: { label: "Drizzle", condition: "Moderate drizzle" },
  55: { label: "Dense Drizzle", condition: "Dense drizzle" },
  61: { label: "Light Rain", condition: "Slight rain" },
  63: { label: "Rain", condition: "Moderate rain" },
  65: { label: "Heavy Rain", condition: "Heavy rain" },
  66: { label: "Freezing Rain", condition: "Light freezing rain" },
  67: { label: "Freezing Rain", condition: "Heavy freezing rain" },
  71: { label: "Light Snow", condition: "Slight snow" },
  73: { label: "Snow", condition: "Moderate snow" },
  75: { label: "Heavy Snow", condition: "Heavy snow" },
  77: { label: "Snow Grains", condition: "Snow grains" },
  80: { label: "Rain Showers", condition: "Slight rain showers" },
  81: { label: "Rain Showers", condition: "Moderate rain showers" },
  82: { label: "Rain Showers", condition: "Violent rain showers" },
  85: { label: "Snow Showers", condition: "Slight snow showers" },
  86: { label: "Snow Showers", condition: "Heavy snow showers" },
  95: { label: "Thunderstorm", condition: "Thunderstorm" },
  96: { label: "Thunderstorm", condition: "Thunderstorm with slight hail" },
  99: { label: "Thunderstorm", condition: "Thunderstorm with heavy hail" },
};

export function getWeatherInfo(code: number) {
  return (
    WMO_WEATHER_CODES[code] ?? {
      label: "Unknown",
      condition: "Unknown conditions",
    }
  );
}

function getWeatherCategory(code: number): WeatherIconVariant {
  if (code <= 1) return "sunny";
  if (code === 2) return "partly-cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code === 3) return "cloudy";
  if (code >= 51 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rainy";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "thunderstorm";
  return "partly-cloudy";
}

export function WeatherIconComponent({
  code,
  size = 72,
  className,
  alt,
}: {
  code: number;
  size?: number;
  className?: string;
  alt?: string;
}) {
  const variant = getWeatherCategory(code);
  return <WeatherIcon variant={variant} size={size} className={className} alt={alt} />;
}
