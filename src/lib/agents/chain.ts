import { confidenceFromData, maxRisk, normalizeRisk, raiseRisk } from "@/lib/risk";
import { getNvidiaConfig } from "@/lib/nvidia";
import type { CommunityReport, RiskAnalysis, RiskLevel, UserType, WeatherSnapshot } from "@/lib/types";

type WeatherAgentOutput = {
  weather_risk_level: RiskLevel;
  detected_threats: string[];
  main_threat: string;
  reasoning_summary: string;
  confidence: "Low" | "Medium" | "High";
};

type DisasterOutput = {
  target_group: string;
  emergency_actions: string[];
  avoid_actions: string[];
  escalation_advice: string;
};

type CommunityOutput = {
  community_risk_signal: "None" | "Weak" | "Moderate" | "Strong";
  verified_patterns: string[];
  risk_adjustment: "No change" | "Increase one level" | "Increase two levels";
  summary: string;
};

const agentChain = [
  "master_orchestrator",
  "weather_intelligence",
  "disaster_response",
  "community_intelligence",
  "offline_accessibility",
  "notification_escalation",
  "translation",
];

export async function runStormBridgeChain(input: {
  location: string;
  userType: UserType;
  weather: WeatherSnapshot;
  communityReports: CommunityReport[];
  targetLanguage?: string;
}): Promise<RiskAnalysis> {
  const deterministic = runDeterministicChain(input);
  const ai = await runNvidiaAnalysis(input, deterministic);

  return {
    ...deterministic,
    ...(ai.analysis ?? {}),
    meta: {
      ai_available: Boolean(ai.analysis),
      fallback_used: !ai.analysis || input.weather.source === "fallback",
      chain: agentChain,
      missing_keys: missingKeys(),
      ai_error: ai.error,
    },
  };
}

function runDeterministicChain(input: {
  location: string;
  userType: UserType;
  weather: WeatherSnapshot;
  communityReports: CommunityReport[];
}): RiskAnalysis {
  const weatherRisk = weatherIntelligenceAgent(input.weather);
  const community = communityIntelligenceAgent(input.communityReports);
  const risk_level = adjustRisk(weatherRisk.weather_risk_level, community.risk_adjustment);
  const disaster = disasterResponseAgent({
    location: input.location,
    riskLevel: risk_level,
    mainThreat: weatherRisk.main_threat,
    userType: input.userType,
    detectedThreats: weatherRisk.detected_threats,
  });
  const offline = offlineAccessibilityAgent({
    location: input.location,
    riskLevel: risk_level,
    mainThreat: weatherRisk.main_threat,
    recommendedActions: disaster.emergency_actions,
  });
  const notification = notificationAgent({
    location: input.location,
    riskLevel: risk_level,
    mainThreat: weatherRisk.main_threat,
    affectedGroups: affectedGroupsForRisk(risk_level, input.userType),
    alertMessage: offline.sms_alert,
  });
  const alert_message = translationAgent(notification.final_alert_message, "English");

  return {
    location: input.weather.location || input.location,
    risk_level,
    main_threat: weatherRisk.main_threat,
    summary: [weatherRisk.reasoning_summary, community.summary].filter(Boolean).join(" "),
    recommended_actions: disaster.emergency_actions,
    offline_message: offline.offline_message,
    alert_message: alert_message.translated_alert,
    affected_groups: notification.recipients,
    confidence: input.weather.source === "fallback" ? "Low" : weatherRisk.confidence,
  };
}

function weatherIntelligenceAgent(weather: WeatherSnapshot): WeatherAgentOutput {
  const threats: Array<{ name: string; level: RiskLevel }> = [];
  const rainfall = weather.rainfall ?? 0;
  const wind = weather.wind_speed ?? 0;
  const temp = weather.temperature ?? 0;
  const humidity = weather.humidity ?? 0;

  if (rainfall >= 20) threats.push({ name: "Flash flooding", level: "Critical" });
  else if (rainfall >= 8) threats.push({ name: "Flooding", level: "High" });
  else if (rainfall >= 3) threats.push({ name: "Slippery roads", level: "Medium" });

  if (wind >= 65) threats.push({ name: "Damaging wind", level: "Critical" });
  else if (wind >= 40) threats.push({ name: "Strong wind", level: "High" });
  else if (wind >= 25) threats.push({ name: "Wind gusts", level: "Medium" });

  if (temp >= 40) threats.push({ name: "Extreme heat stress", level: "High" });
  else if (temp >= 35 && humidity >= 60) threats.push({ name: "Heat stress", level: "Medium" });

  if (weather.weather_condition.includes("visibility")) threats.push({ name: "Poor road visibility", level: "Medium" });

  const level = threats.length ? maxRisk(threats.map((threat) => threat.level)) : "Low";
  const mainThreat = threats[0]?.name ?? weather.weather_condition;
  const confidence = confidenceFromData([weather.rainfall, weather.wind_speed, weather.temperature, weather.humidity], weather.source === "fallback");

  return {
    weather_risk_level: level,
    detected_threats: threats.map((threat) => threat.name),
    main_threat: mainThreat,
    reasoning_summary:
      weather.source === "fallback"
        ? "Live weather is unavailable, so StormBridge is using saved guidance and lower confidence."
        : `${weather.weather_condition} reported with rainfall ${weather.rainfall ?? "unknown"} mm, wind ${weather.wind_speed ?? "unknown"} km/h, and temperature ${weather.temperature ?? "unknown"} C.`,
    confidence,
  };
}

function disasterResponseAgent(input: {
  location: string;
  riskLevel: RiskLevel;
  mainThreat: string;
  userType: UserType;
  detectedThreats: string[];
}): DisasterOutput {
  const commonActions: Record<UserType, string[]> = {
    citizen: ["Move important items above floor level", "Avoid flooded roads and fast water", "Keep phone charged and stay near family"],
    farmer: ["Move tools, seed, and animals to higher ground", "Clear drains around farm buildings", "Delay field work during heavy rain"],
    school: ["Keep pupils indoors and away from weak structures", "Confirm safe pickup routes", "Share one clear update with guardians"],
    transporter: ["Avoid bridges, low roads, and water crossings", "Park in a safe open area if visibility drops", "Tell passengers the safest delay plan"],
    health_worker: ["Check emergency supplies and backup power", "Keep clinic access routes clear", "Prepare simple patient transfer steps"],
    responder: ["Prioritize flooded roads and trapped people", "Send teams with lights and first aid", "Update dashboard status after every action"],
  };

  const actions = commonActions[input.userType].slice(0, 3);
  const escalation =
    input.riskLevel === "High" || input.riskLevel === "Critical"
      ? "Contact official emergency services and local responders now."
      : "Monitor conditions and prepare to act if risk rises.";

  return {
    target_group: input.userType,
    emergency_actions: actions,
    avoid_actions: ["Do not walk or drive through moving flood water", "Do not spread unconfirmed warnings"],
    escalation_advice: escalation,
  };
}

function communityIntelligenceAgent(reports: CommunityReport[]): CommunityOutput {
  const recent = reports.filter((report) => {
    if (!report.created_at) return true;
    return Date.now() - new Date(report.created_at).getTime() < 1000 * 60 * 60 * 24;
  });
  const severeCount = recent.filter((report) => report.severity === "High" || report.severity === "Critical").length;
  const lifeDanger = recent.some((report) => /trapped|injur|death|life|clinic|hospital/i.test(report.description));
  const categories = [...new Set(recent.map((report) => report.report_type))];

  let signal: CommunityOutput["community_risk_signal"] = "None";
  let adjustment: CommunityOutput["risk_adjustment"] = "No change";
  if (lifeDanger || severeCount >= 3) {
    signal = "Strong";
    adjustment = "Increase two levels";
  } else if (severeCount >= 1 || recent.length >= 3) {
    signal = "Moderate";
    adjustment = "Increase one level";
  } else if (recent.length > 0) {
    signal = "Weak";
  }

  return {
    community_risk_signal: signal,
    verified_patterns: categories,
    risk_adjustment: adjustment,
    summary: recent.length ? `${recent.length} recent community report(s) mention ${categories.join(", ")}.` : "No recent community danger reports found.",
  };
}

function offlineAccessibilityAgent(input: {
  location: string;
  riskLevel: RiskLevel;
  mainThreat: string;
  recommendedActions: string[];
}) {
  const firstAction = input.recommendedActions[0] ?? "Stay alert and keep your phone charged";
  const offline_message = `${input.location}: ${input.riskLevel} risk from ${input.mainThreat}. ${firstAction}. Avoid unsafe roads and check on vulnerable people.`;

  return {
    offline_card_title: `${input.riskLevel} risk: ${input.mainThreat}`,
    offline_message: offline_message.split(" ").slice(0, 58).join(" "),
    sms_alert: `${input.riskLevel} weather risk in ${input.location}: ${input.mainThreat}. ${firstAction}.`,
    storage_priority: input.riskLevel === "High" || input.riskLevel === "Critical" ? "High" : input.riskLevel,
  };
}

function notificationAgent(input: {
  location: string;
  riskLevel: RiskLevel;
  mainThreat: string;
  affectedGroups: string[];
  alertMessage: string;
}) {
  const urgent = input.riskLevel === "High" || input.riskLevel === "Critical";
  return {
    send_alert: urgent,
    urgency: input.riskLevel,
    channels: urgent ? ["dashboard", "SMS", "WhatsApp"] : ["dashboard"],
    recipients: urgent ? [...new Set(["responders", "community leaders", ...input.affectedGroups])] : input.affectedGroups,
    final_alert_message: input.alertMessage,
  };
}

function translationAgent(alertMessage: string, targetLanguage: string) {
  return {
    language: targetLanguage,
    translated_alert: alertMessage,
  };
}

function affectedGroupsForRisk(risk: RiskLevel, userType: UserType) {
  const base = [userType.replace("_", " ")];
  if (risk === "High" || risk === "Critical") return [...base, "farmers", "transporters", "schools", "health workers"];
  if (risk === "Medium") return [...base, "farmers", "transporters"];
  return base;
}

function adjustRisk(level: RiskLevel, adjustment: CommunityOutput["risk_adjustment"]) {
  if (adjustment === "Increase two levels") return raiseRisk(level, 2);
  if (adjustment === "Increase one level") return raiseRisk(level, 1);
  return level;
}

function missingKeys() {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!getNvidiaConfig("risk").apiKey) missing.push("NVIDIA_RISK_API_KEY or NVIDIA_API_KEY");
  return missing;
}

async function runNvidiaAnalysis(
  input: {
    location: string;
    userType: UserType;
    weather: WeatherSnapshot;
    communityReports: CommunityReport[];
    targetLanguage?: string;
  },
  fallback: RiskAnalysis,
): Promise<{ analysis: Partial<RiskAnalysis> | null; error?: string }> {
  const { apiKey, baseUrl, model } = getNvidiaConfig("risk");
  if (!apiKey) return { analysis: null, error: "Missing NVIDIA_RISK_API_KEY or NVIDIA_API_KEY" };

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are the StormBridge AI master orchestrator for an international disaster preparedness product. Return only valid JSON matching the requested schema. Use simple, location-neutral emergency language. Do not invent weather values.",
          },
          {
            role: "user",
            content: JSON.stringify({
              schema: {
                location: "",
                risk_level: "Low | Medium | High | Critical",
                main_threat: "",
                summary: "",
                recommended_actions: [],
                offline_message: "",
                alert_message: "",
                affected_groups: [],
                confidence: "Low | Medium | High",
              },
              agent_chain: agentChain,
              input,
              deterministic_baseline: fallback,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { analysis: null, error: `NVIDIA ${response.status}: ${detail.slice(0, 180)}` };
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return { analysis: null, error: "NVIDIA returned no message content" };
    const parsed = JSON.parse(content) as Partial<RiskAnalysis>;

    return {
      analysis: {
        ...parsed,
        risk_level: normalizeRisk(parsed.risk_level),
        recommended_actions: Array.isArray(parsed.recommended_actions) ? parsed.recommended_actions.slice(0, 5) : fallback.recommended_actions,
        affected_groups: Array.isArray(parsed.affected_groups) ? parsed.affected_groups : fallback.affected_groups,
      },
    };
  } catch (error) {
    return { analysis: null, error: error instanceof Error ? error.message : "NVIDIA analysis failed" };
  }
}
