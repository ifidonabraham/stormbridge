import { simpleThreatForWeatherCode } from "@/lib/risk";
import type { WeatherSnapshot } from "@/lib/types";

type GeoResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

export async function fetchWeatherForLocation(location: string): Promise<WeatherSnapshot> {
  try {
    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.searchParams.set("name", location);
    geoUrl.searchParams.set("count", "1");
    geoUrl.searchParams.set("language", "en");
    geoUrl.searchParams.set("format", "json");

    const geoResponse = await fetch(geoUrl, { next: { revalidate: 600 } });
    if (!geoResponse.ok) throw new Error("Geocoding failed");
    const geoData = (await geoResponse.json()) as { results?: GeoResult[] };
    const place = geoData.results?.[0];
    if (!place) throw new Error("Location was not found");

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", String(place.latitude));
    weatherUrl.searchParams.set("longitude", String(place.longitude));
    weatherUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code");
    weatherUrl.searchParams.set("timezone", "auto");

    const weatherResponse = await fetch(weatherUrl, { next: { revalidate: 300 } });
    if (!weatherResponse.ok) throw new Error("Weather request failed");
    const weatherData = await weatherResponse.json();
    const current = weatherData.current ?? {};
    const readableLocation = [place.name, place.admin1, place.country].filter(Boolean).join(", ");

    return {
      location: readableLocation || location,
      latitude: place.latitude,
      longitude: place.longitude,
      temperature: current.temperature_2m ?? null,
      humidity: current.relative_humidity_2m ?? null,
      rainfall: current.precipitation ?? null,
      wind_speed: current.wind_speed_10m ?? null,
      weather_condition: simpleThreatForWeatherCode(current.weather_code),
      forecast_time: current.time ?? new Date().toISOString(),
      source: "open-meteo",
    };
  } catch {
    return fallbackWeather(location);
  }
}

export function fallbackWeather(location: string): WeatherSnapshot {
  return {
    location,
    latitude: 0,
    longitude: 0,
    temperature: null,
    humidity: null,
    rainfall: null,
    wind_speed: null,
    weather_condition: "Weather service unavailable",
    forecast_time: new Date().toISOString(),
    source: "fallback",
  };
}
