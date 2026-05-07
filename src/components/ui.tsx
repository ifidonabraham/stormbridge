import { AlertTriangle, CheckCircle2, Info, Siren } from "lucide-react";
import type { RiskLevel } from "@/lib/types";

const badgeClass: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
  High: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
  Critical: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
};

export function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">{children}</main>;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`surface rounded-2xl p-4 sm:p-6 ${className}`}>{children}</section>;
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass[level]}`}>{level}</span>;
}

export function StatusIcon({ level }: { level: RiskLevel }) {
  if (level === "Critical") return <Siren className="text-emergency-red" size={28} />;
  if (level === "High") return <AlertTriangle className="text-emergency-orange" size={28} />;
  if (level === "Medium") return <Info className="text-emergency-amber" size={28} />;
  return <CheckCircle2 className="text-emergency-green" size={28} />;
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm dark:border-white/10 dark:bg-white/[0.04]">
      <p className="font-semibold text-slate-950 dark:text-white">{title}</p>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  );
}
