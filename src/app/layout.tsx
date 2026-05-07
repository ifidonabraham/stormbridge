import type { Metadata } from "next";
import { BarChart3, CloudSun, FileWarning, LayoutDashboard, ShieldAlert, WifiOff, type LucideIcon } from "lucide-react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "StormBridge AI",
  description: "Weather intelligence and disaster preparedness for connected and offline communities.",
};

const navItems: Array<[string, string, LucideIcon]> = [
  ["Overview", "/", LayoutDashboard],
  ["Analyze", "/check", CloudSun],
  ["Reports", "/report", FileWarning],
  ["Response", "/dashboard", BarChart3],
  ["Offline", "/offline", WifiOff],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
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
            <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/[0.76] lg:hidden">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white">
                  <ShieldAlert size={20} />
                  StormBridge
                </Link>
              </div>
              <nav className="mt-3 flex gap-1 overflow-x-auto text-sm">
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
