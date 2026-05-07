export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type Confidence = "Low" | "Medium" | "High";

export type UserType = "citizen" | "farmer" | "school" | "transporter" | "health_worker" | "responder";

export type WeatherSnapshot = {
  location: string;
  latitude: number;
  longitude: number;
  temperature: number | null;
  humidity: number | null;
  rainfall: number | null;
  wind_speed: number | null;
  weather_condition: string;
  forecast_time: string;
  source: "open-meteo" | "fallback";
};

export type CommunityReport = {
  id?: string;
  location: string;
  report_type: string;
  description: string;
  severity: RiskLevel;
  status?: "New" | "Reviewing" | "Escalated" | "Resolved";
  contact?: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
};

export type RiskAnalysis = {
  location: string;
  risk_level: RiskLevel;
  main_threat: string;
  summary: string;
  recommended_actions: string[];
  offline_message: string;
  alert_message: string;
  affected_groups: string[];
  confidence: Confidence;
  meta?: {
    ai_available: boolean;
    fallback_used: boolean;
    chain: string[];
    missing_keys: string[];
    ai_error?: string;
  };
};
