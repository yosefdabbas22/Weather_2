import { NextRequest, NextResponse } from "next/server";
import type { GeocodingResponse } from "@/types/weather";
import countryCapitals from "@/data/country-capitals.json";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

type CountryCapital = {
  lat: number;
  lon: number;
  names: Record<string, string>;
  capital: Record<string, string>;
};

const CAPITALS = countryCapitals as Record<string, CountryCapital>;

function findMatchingCountry(query: string): string | null {
  const q = query.trim();
  if (!q) return null;
  const qLower = q.toLowerCase();
  for (const [code, data] of Object.entries(CAPITALS)) {
    const names = data.names ?? {};
    for (const name of Object.values(names)) {
      if (!name || typeof name !== "string") continue;
      const n = name.trim();
      if (!n) continue;
      if (qLower === n.toLowerCase() || n.toLowerCase().includes(qLower) || qLower.includes(n.toLowerCase())) {
        return code;
      }
    }
  }
  return null;
}

function getCapitalForCountry(code: string, lang: string): { name: string; country: string } | null {
  const data = CAPITALS[code];
  if (!data?.capital || !data?.names) return null;
  const capitalName = data.capital[lang] ?? data.capital.en;
  const countryName = data.names[lang] ?? data.names.en;
  if (!capitalName || !countryName) return null;
  return { name: capitalName, country: countryName };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const lang = request.nextUrl.searchParams.get("language")?.toLowerCase() || "en";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(q)}&count=8&format=json&language=${encodeURIComponent(lang)}`
    );
    const data: GeocodingResponse = await res.json();

    const seen = new Set<string>();
    const apiResults = (data.results ?? [])
      .filter((r) => {
        const key = `${r.name}|${r.country}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((r) => ({ name: r.name, country: r.country }));

    const matchedCountry = findMatchingCountry(q);
    const capitalEntry = matchedCountry ? getCapitalForCountry(matchedCountry, lang) : null;

    let results: Array<{ name: string; country: string }> = [];

    if (capitalEntry) {
      const capitalKey = `${capitalEntry.name}|${capitalEntry.country}`;
      if (!seen.has(capitalKey)) {
        results.push(capitalEntry);
        seen.add(capitalKey);
      }
    }

    for (const r of apiResults) {
      if (results.length >= 8) break;
      results.push(r);
    }

    results = results.slice(0, 8);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Geocode API error:", error);
    return NextResponse.json({ results: [] });
  }
}
