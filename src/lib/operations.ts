import type { RiskLevel } from "@/lib/types";

export type ResponderUnit = {
  id: string;
  name: string;
  role: string;
  status: "Available" | "Investigating" | "Escalated" | "Offline";
  location: string;
  lastSeen: string;
};

export type ActivityItem = {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  severity: RiskLevel;
};

export type NotificationItem = {
  id: string;
  channel: "Dashboard" | "SMS" | "WhatsApp" | "Email";
  status: "Queued" | "Sent" | "Delivered" | "Failed";
  target: string;
  time: string;
};

export const responderUnits: ResponderUnit[] = [
  { id: "R-12", name: "Alpha Response", role: "Field verification", status: "Investigating", location: "Manila, Philippines", lastSeen: "2m ago" },
  { id: "R-18", name: "Utility Liaison", role: "Power restoration", status: "Available", location: "Jakarta, Indonesia", lastSeen: "5m ago" },
  { id: "R-22", name: "Road Access Team", role: "Route clearance", status: "Escalated", location: "Kingston, Jamaica", lastSeen: "8m ago" },
  { id: "R-31", name: "Clinic Support", role: "Health access", status: "Available", location: "Regional standby", lastSeen: "12m ago" },
];

export const activityFeed: ActivityItem[] = [
  { id: "A-104", time: "1m ago", actor: "AI risk chain", action: "raised confidence after weather refresh", target: "Manila flood alert", severity: "High" },
  { id: "A-103", time: "4m ago", actor: "Community report", action: "added blocked route evidence", target: "Kingston access disruption", severity: "Medium" },
  { id: "A-102", time: "7m ago", actor: "Responder command", action: "assigned field verification", target: "Alpha Response", severity: "High" },
  { id: "A-101", time: "12m ago", actor: "Offline agent", action: "saved latest guidance card", target: "Manila household checklist", severity: "Medium" },
];

export const notificationQueue: NotificationItem[] = [
  { id: "N-41", channel: "Dashboard", status: "Delivered", target: "Responder Command", time: "1m ago" },
  { id: "N-40", channel: "SMS", status: "Queued", target: "Community leaders", time: "3m ago" },
  { id: "N-39", channel: "WhatsApp", status: "Sent", target: "Field coordinators", time: "5m ago" },
  { id: "N-38", channel: "Email", status: "Delivered", target: "Operations desk", time: "9m ago" },
];

export const trendMetrics = [
  { label: "Risk checks", value: "24", delta: "+18%", tone: "up" },
  { label: "Reports received", value: "11", delta: "+7%", tone: "up" },
  { label: "Avg response time", value: "8m", delta: "-12%", tone: "down" },
  { label: "Offline cards", value: "17", delta: "+5%", tone: "up" },
] as const;

export function statusTone(status: string) {
  if (["Delivered", "Resolved", "Available", "Sent"].includes(status)) return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20";
  if (["Escalated", "Failed", "Offline"].includes(status)) return "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-500/10 dark:border-red-500/20";
  if (["Queued", "Investigating", "Reviewing"].includes(status)) return "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20";
  return "text-slate-700 bg-slate-50 border-slate-200 dark:text-slate-300 dark:bg-white/[0.05] dark:border-white/10";
}
