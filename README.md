# Weather App

A production-ready, multilingual weather application built with Next.js 14, TypeScript, and Tailwind CSS. Features real-time weather data, geolocation, and support for 15+ languages including RTL layouts.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)

---

## Features

| Feature | Description |
|---------|-------------|
| **City Search** | Search any city worldwide with autocomplete suggestions |
| **Capital-First** | Country searches prioritize capital cities (e.g., "Jordan" → Amman first) |
| **Geolocation** | Automatic location detection on first visit |
| **15+ Languages** | Full i18n support: Arabic, German, French, Japanese, Spanish, and more |
| **RTL Support** | Automatic right-to-left layout for Arabic and Hebrew |
| **Unit Toggle** | Switch between Celsius and Fahrenheit |
| **5-Day Forecast** | Daily high/low temperatures with localized conditions |
| **Recent Searches** | Up to 5 recent searches per language, persisted in localStorage |
| **Weather Icons** | Custom icons for all conditions (sunny, rain, snow, thunderstorm, etc.) |
| **Responsive** | Mobile, tablet, and desktop optimized |
| **Accessible** | Keyboard navigation, ARIA labels, semantic HTML |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **APIs:** Open-Meteo (weather + geocoding), Nominatim (reverse geocoding)
- **Font:** Space Grotesk

---

## Prerequisites

- Node.js 18+ 
- npm or yarn

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/USERNAME/weather-app.git
cd weather-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── geocode/       # City search suggestions
│   │   ├── geolocation/   # Weather by coordinates
│   │   └── weather/       # Weather by city name
│   ├── layout.tsx
│   └── page.tsx
├── components/            # React components
├── contexts/              # React context (Language)
├── data/                  # Static data (languages, country-capitals)
├── hooks/                 # Custom hooks
├── lib/                   # Utilities, weather codes
├── locales/               # Translation files (15 languages)
└── types/                 # TypeScript definitions
```

---

## API Routes

| Endpoint | Parameters | Description |
|----------|------------|-------------|
| `GET /api/weather` | `city`, `unit`, `language` | Fetch weather by city name |
| `GET /api/geolocation` | `lat`, `lon`, `unit`, `language` | Fetch weather by coordinates |
| `GET /api/geocode` | `q`, `language` | City search suggestions (capital-first) |

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0F1417` | Page background |
| Card | `#26303B` | Cards, dropdowns |
| Border | `#384757` | Borders, dividers |
| Muted | `#99ABBD` | Secondary text |
| Font | Space Grotesk | Primary typography |

---

## Supported Languages

English, Arabic (RTL), German, Spanish, French, Irish, Hebrew (RTL), Hindi, Italian, Japanese, Korean, Portuguese, Russian, Turkish, Chinese

---

## License

MIT
