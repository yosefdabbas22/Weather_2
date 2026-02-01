import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const lang = searchParams.get("language")?.toLowerCase() || "en";

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "invalid", errorCode: "COORDS_REQUIRED" },
      { status: 400 }
    );
  }

  try {
    const reverseRes = await fetch(
      `${NOMINATIM_REVERSE_URL}?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "WeatherApp/1.0",
          "Accept-Language": lang,
        },
      }
    );
    const reverseData = await reverseRes.json();

    let city = "Unknown";
    let country = "Unknown";
    const timezone = "auto";

    if (reverseData.address) {
      city = reverseData.address.city || reverseData.address.town || reverseData.address.village || reverseData.address.county || "Unknown";
      country = reverseData.address.country || "Unknown";
    }

    // Always Celsius and km/h from API; client converts for display
    const forecastRes = await fetch(
      `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&timezone=${encodeURIComponent(timezone)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh`
    );

    if (!forecastRes.ok) {
      throw new Error("FETCH_FAILED");
    }

    const forecastData = await forecastRes.json();
    const current = forecastData.current;
    const daily = forecastData.daily;

    const dailyForecast = daily.time.slice(0, 6).map((dateStr: string, i: number) => ({
      date: dateStr,
      weatherCode: daily.weather_code[i],
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
    }));

    return NextResponse.json({
      city,
      country,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      windUnit: "kmh",
      weatherCode: current.weather_code,
      dailyForecast,
    });
  } catch (error) {
    console.error("Geolocation API error:", error);
    return NextResponse.json(
      { error: "fetch_failed", errorCode: "FETCH_FAILED" },
      { status: 500 }
    );
  }
}
