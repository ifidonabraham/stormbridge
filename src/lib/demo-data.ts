import type { CommunityReport, RiskAnalysis } from "@/lib/types";

export const demoReports: CommunityReport[] = [
  {
    id: "demo-1",
    location: "Manila, Philippines",
    report_type: "flooding",
    description: "Water is rising near homes along a low road.",
    severity: "High",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    location: "Kingston, Jamaica",
    report_type: "blocked road",
    description: "A main road is blocked after heavy rain and debris.",
    severity: "Medium",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    location: "Jakarta, Indonesia",
    report_type: "power outage",
    description: "Power is out after strong wind near the river district.",
    severity: "Medium",
    created_at: new Date().toISOString(),
  },
];

export const demoAlerts: RiskAnalysis[] = [
  {
    location: "Manila, Philippines",
    risk_level: "High",
    main_threat: "Flooding",
    summary: "Heavy rainfall and community reports point to rising flood risk near low roads.",
    recommended_actions: ["Avoid flooded streets", "Move valuables above floor level", "Check on vulnerable neighbours"],
    offline_message: "High flood risk. Avoid flooded roads, move important items higher, and keep phones charged.",
    alert_message: "High flood risk reported. Avoid flooded roads and move to safer ground if water rises.",
    affected_groups: ["residents", "transporters", "responders"],
    confidence: "Medium",
  },
];
