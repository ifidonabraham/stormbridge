import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchWeatherForLocation } from "@/lib/weather";

const requestSchema = z.object({
  location: z.string().min(2),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid location." }, { status: 400 });
  }

  const weather = await fetchWeatherForLocation(parsed.data.location);
  return NextResponse.json({ weather, fallback_used: weather.source === "fallback" });
}
