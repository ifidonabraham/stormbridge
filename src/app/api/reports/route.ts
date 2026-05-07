import { NextResponse } from "next/server";
import { z } from "zod";
import { demoReports } from "@/lib/demo-data";
import { getSupabaseServerClient } from "@/lib/supabase";

const reportSchema = z.object({
  location: z.string().min(2),
  report_type: z.string().min(2),
  description: z.string().min(5),
  severity: z.enum(["Low", "Medium", "High", "Critical"]).default("Medium"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ reports: demoReports, fallback_used: true });

  const { data, error } = await supabase.from("community_reports").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json({ reports: demoReports, fallback_used: true, error: error.message });

  return NextResponse.json({ reports: data ?? [], fallback_used: false });
}

export async function POST(request: Request) {
  const parsed = reportSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the report form." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ report: { id: crypto.randomUUID(), ...parsed.data, created_at: new Date().toISOString() }, fallback_used: true });
  }

  const { data, error } = await supabase.from("community_reports").insert(parsed.data).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ report: data, fallback_used: false });
}
