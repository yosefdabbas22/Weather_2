export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Convert Celsius to Fahrenheit (client-side only) */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/** Convert km/h to mph (client-side only) */
export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}
