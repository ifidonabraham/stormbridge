import Link from "next/link";
import { ArrowRight, CloudRain, RadioTower, ShieldCheck, type LucideIcon } from "lucide-react";
import { PageShell, Panel } from "@/components/ui";

const featureCards: Array<{ Icon: LucideIcon; title: string; text: string; href: string }> = [
  { Icon: CloudRain, title: "Weather intelligence", text: "Open-Meteo data is checked for flood, wind, heat, and visibility risk.", href: "/check" },
  {
    Icon: ShieldCheck,
    title: "Risk guidance",
    text: "The agent chain turns risk into clear actions for residents, workers, institutions, responders, and vulnerable groups.",
    href: "/check",
  },
  { Icon: RadioTower, title: "Offline access", text: "The last alert is saved on the device so safety steps remain available without internet.", href: "/offline" },
];

export default function Home() {
  return (
    <PageShell>
      <section className="grid gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-black/5 bg-white/70 px-3 py-1 text-sm font-semibold text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
            Emergency intelligence platform
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-7xl">StormBridge AI</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Weather intelligence, disaster preparedness, risk analysis, community reports, and offline guidance for communities and responders anywhere.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/check" className="focus-ring inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
              Analyze location <ArrowRight size={18} />
            </Link>
            <Link href="/report" className="focus-ring inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-3 font-semibold text-slate-800 shadow-soft transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
              Report hazard
            </Link>
          </div>
        </div>

        <Panel className="overflow-hidden p-0">
          <div className="border-b border-black/5 p-6 dark:border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Live command view</p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Online</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Global risk chain</h2>
          </div>
          <div className="grid gap-3 p-4">
            {[
              ["Weather signal", "Open-Meteo", "Live forecast"],
              ["AI risk engine", "NVIDIA", "Guidance JSON"],
              ["Response memory", "Supabase", "Alerts + reports"],
            ].map(([label, source, value]) => (
              <div key={label} className="rounded-2xl border border-black/5 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 font-semibold text-slate-950 dark:text-white">{source}</p>
                  </div>
                  <p className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-soft dark:bg-white/10 dark:text-slate-300">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 pb-10 md:grid-cols-3">
          {featureCards.map(({ Icon, title, text, href }) => (
            <Link key={title} href={href} className="block rounded-2xl focus-ring">
              <Panel className="h-full transition hover:-translate-y-1">
              <Icon className="mb-5 text-emergency-green" size={26} />
              <h2 className="font-semibold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
              </Panel>
            </Link>
          ))}
      </section>
    </PageShell>
  );
}
