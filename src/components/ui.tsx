import { AlertTriangle, CheckCircle2, Info, Siren } from "lucide-react";
import type { RiskLevel } from "@/lib/types";

const badgeClass: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
  High: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
  Critical: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
};

export function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="px-3 pb-24 pt-4 sm:px-6 sm:py-6 lg:px-8 lg:pb-6">{children}</main>;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`surface rounded-2xl p-3 sm:p-6 ${className}`}>{children}</section>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  mobileTitle,
  mobileDescription,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  mobileTitle?: string;
  mobileDescription?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 border-b border-black/5 pb-4 dark:border-white/10 sm:mb-6 sm:gap-4 sm:pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-emergency-green">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:mt-2 sm:text-4xl">
          {mobileTitle ? <span className="sm:hidden">{mobileTitle}</span> : null}
          <span className={mobileTitle ? "hidden sm:inline" : undefined}>{title}</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {mobileDescription ? <span className="sm:hidden">{mobileDescription}</span> : null}
          <span className={mobileDescription ? "hidden sm:inline" : undefined}>{description}</span>
        </p>
      </div>
      {action ? <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">{action}</div> : null}
    </div>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Panel className="p-3 sm:p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:mt-3 sm:text-2xl">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{detail}</p>
    </Panel>
  );
}

export function TrendCard({ label, value, detail, delta, positive = true }: { label: string; value: string; detail: string; delta: string; positive?: boolean }) {
  return (
    <Panel className="p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${positive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"}`}>{delta}</span>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:mt-3 sm:text-2xl">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{detail}</p>
    </Panel>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass[level]}`}>{level}</span>;
}

export function StatusBadge({ status }: { status: "New" | "Reviewing" | "Escalated" | "Resolved" }) {
  const classes = {
    New: "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300",
    Reviewing: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
    Escalated: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
    Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  }[status];

  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
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

export function PrimaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-soft disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 ${className}`}
    >
      {children}
    </button>
  );
}

export function InlinePill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}
