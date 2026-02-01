import { NextRequest, NextResponse } from "next/server";
import type {
  GeocodingResponse,
  WeatherForecastResponse,
} from "@/types/weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");
  const lang = searchParams.get("language")?.toLowerCase() || "en";

  if (!city || city.length < 2) {
    return NextResponse.json(
      { error: "invalid", errorCode: "CITY_TOO_SHORT" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ Geocoding
    const geocodingRes = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(
        city
      )}&count=5&language=${encodeURIComponent(lang)}`
    );

    const geocodingData: GeocodingResponse = await geocodingRes.json();

    if (!geocodingData.results?.length) {
      return NextResponse.json(
        { error: "not_found", errorCode: "CITY_NOT_FOUND" },
        { status: 404 }
      );
    }

    const location = geocodingData.results[0];
    const { latitude, longitude, timezone } = location;

    // 2️⃣ Weather forecast (ALWAYS Celsius + km/h)
    const forecastRes = await fetch(
      `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&timezone=${encodeURIComponent(
        timezone
      )}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh`
    );

    if (!forecastRes.ok) {
      throw new Error("FETCH_FAILED");
    }

    const forecastData: WeatherForecastResponse = await forecastRes.json();

    const { current, daily } = forecastData;

    // 3️⃣ Today + next 5 days (TOTAL = 6 days)
    const dailyForecast = daily.time.slice(0, 6).map((dateStr, i) => ({
      date: dateStr,
      weatherCode: daily.weather_code[i],
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
    }));

    return NextResponse.json({
      city: location.name,
      country: location.country,
      latitude,
      longitude,

      // Always Celsius from API
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      windUnit: "km/h",
      weatherCode: current.weather_code,

      dailyForecast,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "fetch_failed", errorCode: "FETCH_FAILED" },
      { status: 500 }
    );
  }
}
