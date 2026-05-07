import Link from "next/link";
import { ArrowRight, CloudSun, Database, RadioTower, ShieldCheck } from "lucide-react";
import { PageHeader, PageShell, Panel, StatCard } from "@/components/ui";

const workflow = [
  {
    step: "1",
    title: "Analyze exposure",
    detail: "Enter any location and user group to create a weather-aware risk decision.",
    href: "/check",
  },
  {
    step: "2",
    title: "Collect field signals",
    detail: "Community reports add ground truth for roads, clinics, schools, power, and flood impact.",
    href: "/report",
  },
  {
    step: "3",
    title: "Coordinate response",
    detail: "Responders review alerts and reports from one operational dashboard.",
    href: "/dashboard",
  },
  {
    step: "4",
    title: "Preserve guidance offline",
    detail: "The latest alert remains available on-device when connectivity drops.",
    href: "/offline",
  },
];

const systems = [
  ["Weather", "Open-Meteo", "Live forecast and hazard indicators", CloudSun],
  ["Risk model", "NVIDIA", "Structured emergency guidance", ShieldCheck],
  ["Persistence", "Supabase", "Alerts, reports, and checked locations", Database],
  ["Offline", "localStorage", "Last-mile emergency card", RadioTower],
];

export default function Home() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Command overview"
        title="Operational weather intelligence"
        description="A dashboard-first workflow for detecting risk, gathering field reports, coordinating response, and preserving offline guidance."
        action={
          <Link href="/check" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
            New analysis <ArrowRight size={16} />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Primary action" value="Analyze" detail="Start with a location check" />
        <StatCard label="Attention queue" value="Reports" detail="Review community hazards" />
        <StatCard label="Response state" value="Live" detail="Supabase-backed operations" />
        <StatCard label="Continuity" value="Offline" detail="Last alert stored locally" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Workflow progression</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Each step produces operational data for the next step.</p>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {workflow.map((item) => (
              <Link key={item.step} href={item.href} className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-white/[0.04] sm:grid-cols-[40px_1fr_auto] sm:items-center">
                <span className="grid size-8 place-items-center rounded-lg border border-black/10 text-sm font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300">{item.step}</span>
                <span>
                  <span className="block font-semibold text-slate-950 dark:text-white">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</span>
                </span>
                <ArrowRight size={16} className="hidden text-slate-400 sm:block" />
              </Link>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-white">System map</h2>
          <div className="mt-4 space-y-3">
            {systems.map(([label, source, detail, Icon]) => (
              <div key={label as string} className="flex gap-3 rounded-xl border border-black/5 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                <Icon size={18} className="mt-0.5 text-emergency-green" />
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{label as string}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{source as string}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">{detail as string}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-6">
        <Panel className="p-0">
          <div className="grid grid-cols-12 border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
            <span className="col-span-5">Operational question</span>
            <span className="col-span-4">Where to answer it</span>
            <span className="col-span-3 text-right">Next action</span>
          </div>
          {[
            ["What is happening?", "Analyze location", "/check"],
            ["What requires attention?", "Responder dashboard", "/dashboard"],
            ["What action should be taken?", "Risk guidance result", "/check"],
            ["What data matters most?", "Reports and alerts", "/dashboard"],
          ].map(([question, area, href]) => (
            <Link key={question} href={href} className="grid grid-cols-12 border-b border-black/5 px-4 py-3 text-sm last:border-b-0 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]">
              <span className="col-span-5 font-medium text-slate-950 dark:text-white">{question}</span>
              <span className="col-span-4 text-slate-600 dark:text-slate-400">{area}</span>
              <span className="col-span-3 text-right font-semibold text-emergency-green">Open</span>
            </Link>
          ))}
        </Panel>
      </section>
    </PageShell>
  );
}
