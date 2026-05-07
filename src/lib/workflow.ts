import type { CommunityReport, RiskAnalysis, RiskLevel } from "@/lib/types";

export const workflowSteps = [
  "Detect risk",
  "Analyze location",
  "Generate guidance",
  "Save alert",
  "Collect reports",
  "Escalate risk",
  "Coordinate response",
  "Preserve offline",
];

export function reportStatus(report: CommunityReport): "New" | "Reviewing" | "Escalated" | "Resolved" {
  if (report.status) return report.status;
  if (report.severity === "Critical" || report.severity === "High") return "Escalated";
  if (report.severity === "Medium") return "Reviewing";
  return "New";
}

export function timeAgo(value?: string) {
  if (!value) return "Just now";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function highPriorityCount(alerts: RiskAnalysis[], reports: CommunityReport[]) {
  return alerts.filter((item) => isHigh(item.risk_level)).length + reports.filter((item) => isHigh(item.severity)).length;
}

export function isHigh(level: RiskLevel) {
  return level === "High" || level === "Critical";
}

export function recommendedResponse(threat: string, level: RiskLevel) {
  if (level === "Critical") return `Escalate immediately and dispatch response lead for ${threat.toLowerCase()}.`;
  if (level === "High") return `Assign responder review and verify ${threat.toLowerCase()} with field reports.`;
  if (level === "Medium") return `Monitor conditions and prepare local advisory for ${threat.toLowerCase()}.`;
  return "Keep monitoring and preserve offline guidance.";
}
