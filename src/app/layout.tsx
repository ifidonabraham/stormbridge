import type { Metadata } from "next";
import { BarChart3, CloudSun, FileWarning, LayoutDashboard, Settings, ShieldAlert, WifiOff, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { ThemeController } from "@/components/theme-controller";
import "./globals.css";

export const metadata: Metadata = {
  title: "StormBridge AI",
  description: "Weather intelligence and disaster preparedness for connected and offline communities.",
};

const navItems: Array<[string, string, LucideIcon]> = [
  ["Overview", "/", LayoutDashboard],
  ["Analyze Risk", "/check", CloudSun],
  ["Community Reports", "/report", FileWarning],
  ["Responder Command", "/dashboard", BarChart3],
  ["Offline Guidance", "/offline", WifiOff],
  ["Settings", "/settings", Settings],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeController />
        <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
          <aside className="hidden border-r border-black/5 bg-white/[0.76] px-3 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/[0.72] lg:block">
            <Link href="/" className="mb-6 flex items-center gap-3 rounded-2xl px-3 py-2 font-semibold text-slate-950 dark:text-white">
              <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <ShieldAlert size={19} />
              </span>
              <span>
                <span className="block leading-5">StormBridge</span>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">Operations</span>
              </span>
            </Link>
            <nav className="space-y-1">
              {navItems.map(([label, href, Icon]) => (
                <Link
                  key={String(href)}
                  href={String(href)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 rounded-2xl border border-black/5 bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
              <p className="font-semibold text-slate-950 dark:text-white">System posture</p>
              <p className="mt-1">Live weather, AI guidance, reports, and offline memory operate as one chain.</p>
            </div>
          </aside>
          <div className="min-w-0">
            <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/[0.76]">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white lg:hidden">
                  <ShieldAlert size={20} />
                  StormBridge
                </Link>
                <div className="hidden items-center gap-2 text-sm lg:flex">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">System online</span>
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">Last sync: live</span>
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">Active alerts: monitored</span>
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">Offline ready</span>
                </div>
              </div>
              <nav className="mt-3 flex gap-1 overflow-x-auto text-sm lg:hidden">
                {navItems.map(([label, href]) => (
                  <Link key={String(href)} href={String(href)} className="rounded-full px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]">
                    {label}
                  </Link>
                ))}
              </nav>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
