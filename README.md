<<<<<<< HEAD
# Weather App

A production-ready weather web application built with Next.js, TypeScript, Tailwind CSS, and the Open-Meteo API.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Open-Meteo API** (geocoding + forecast)
- Server routes for API fetching

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Search by city** - Find weather for any city worldwide
- **Geolocation** - Automatically requests location permission on first visit
- **°C / °F toggle** - Switch between temperature units
- **5-day forecast** - Daily high/low temperatures and conditions
- **Weather icons** - Custom flat-design icons matching the design system
- **Responsive layout** - Mobile, tablet, and desktop support
- **Accessible** - Keyboard navigation and ARIA labels

## Design System

- Background: `#0F1417`
- Card background: `#26303B`
- Border color: `#384757`
- Muted text: `#99ABBD`
- Font: Space Grotesk

## API Routes

- `GET /api/weather?city=<name>&unit=<celsius|fahrenheit>` - Fetch weather by city
- `GET /api/geolocation?lat=<lat>&lon=<lon>&unit=<celsius|fahrenheit>` - Fetch weather by coordinates
=======
# Weather_2
>>>>>>> 7599c694049854847e5f483ec2882b8c2cbaafb2
