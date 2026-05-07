import type { Confidence, RiskLevel } from "@/lib/types";

export const riskOrder: RiskLevel[] = ["Low", "Medium", "High", "Critical"];

export function raiseRisk(level: RiskLevel, steps: number) {
  return riskOrder[Math.min(riskOrder.indexOf(level) + steps, riskOrder.length - 1)];
}

export function maxRisk(levels: RiskLevel[]) {
  return levels.reduce<RiskLevel>((highest, level) => (riskOrder.indexOf(level) > riskOrder.indexOf(highest) ? level : highest), "Low");
}

export function confidenceFromData(values: Array<unknown>, usedFallback: boolean): Confidence {
  const complete = values.filter((value) => value !== null && value !== undefined).length;
  if (usedFallback) return "Low";
  if (complete >= values.length - 1) return "High";
  if (complete >= Math.ceil(values.length / 2)) return "Medium";
  return "Low";
}

export function normalizeRisk(value: unknown): RiskLevel {
  if (value === "Critical" || value === "High" || value === "Medium" || value === "Low") return value;
  return "Low";
}

export function simpleThreatForWeatherCode(code?: number) {
  if (code === undefined) return "Changing weather";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "Heavy rainfall";
  if ([45, 48].includes(code)) return "Low visibility";
  if ([71, 73, 75, 85, 86].includes(code)) return "Severe cold";
  return "Changing weather";
}
