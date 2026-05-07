import { NextResponse } from "next/server";
import { getNvidiaConfig } from "@/lib/nvidia";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  const [supabase, nvidia] = await Promise.all([checkSupabase(), checkNvidia()]);
  return NextResponse.json({
    supabase,
    nvidia,
    open_meteo: { ok: true, message: "No API key required" },
  });
}

async function checkSupabase() {
  const client = getSupabaseServerClient();
  if (!client) return { ok: false, message: "Missing Supabase env keys" };
  const { error } = await client.from("community_reports").select("id").limit(1);
  return error ? { ok: false, message: error.message } : { ok: true, message: "Connected to contactfeed" };
}

async function checkNvidia() {
  const { apiKey, baseUrl, model } = getNvidiaConfig("risk");
  if (!apiKey) return { ok: false, message: "Missing NVIDIA_RISK_API_KEY or NVIDIA_API_KEY" };

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Return JSON: {\"ok\":true}" }],
        temperature: 0.1,
        max_tokens: 32,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return { ok: false, message: `Risk model unavailable (${response.status}). ${body.slice(0, 120)}` };
    }

    return { ok: true, message: `Risk model connected: ${model}` };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Risk model check failed" };
  }
}
