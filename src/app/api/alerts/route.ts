import { NextResponse } from "next/server";
import { demoAlerts } from "@/lib/demo-data";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ alerts: demoAlerts, fallback_used: true });

  const { data, error } = await supabase.from("weather_alerts").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json({ alerts: demoAlerts, fallback_used: true, error: error.message });

  return NextResponse.json({ alerts: data ?? [], fallback_used: false });
}
