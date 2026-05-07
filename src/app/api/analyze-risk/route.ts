import { NextResponse } from "next/server";
import { z } from "zod";
import { runStormBridgeChain } from "@/lib/agents/chain";
import { getSupabaseServerClient } from "@/lib/supabase";
import { fetchWeatherForLocation } from "@/lib/weather";
import type { CommunityReport, UserType } from "@/lib/types";

const userTypes = ["citizen", "farmer", "school", "transporter", "health_worker", "responder"] as const;

const requestSchema = z.object({
  location: z.string().min(2),
  userType: z.enum(userTypes).default("citizen"),
  targetLanguage: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Location and user type are required." }, { status: 400 });
  }

  const { location, userType, targetLanguage } = parsed.data;
  const [weather, reports] = await Promise.all([fetchWeatherForLocation(location), fetchRecentReports(location)]);

  const analysis = await runStormBridgeChain({
    location,
    userType: userType as UserType,
    weather,
    communityReports: reports,
    targetLanguage,
  });

  await Promise.allSettled([saveAlert(analysis), saveUserLocation(location, userType)]);

  return NextResponse.json({ weather, reports, analysis });
}

async function fetchRecentReports(location: string): Promise<CommunityReport[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("community_reports")
    .select("*")
    .ilike("location", `%${location}%`)
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

async function saveAlert(analysis: Awaited<ReturnType<typeof runStormBridgeChain>>) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  await supabase.from("weather_alerts").insert({
    location: analysis.location,
    risk_level: analysis.risk_level,
    main_threat: analysis.main_threat,
    summary: analysis.summary,
    recommended_actions: analysis.recommended_actions,
    offline_message: analysis.offline_message,
    alert_message: analysis.alert_message,
    confidence: analysis.confidence,
  });
}

async function saveUserLocation(location: string, userType: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("user_locations").insert({ location, user_type: userType });
}
