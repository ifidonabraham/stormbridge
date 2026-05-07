import type { Metadata } from "next";
import { BarChart3, CloudSun, FileWarning, LayoutDashboard, Settings, ShieldAlert, WifiOff, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { ThemeController } from "@/components/theme-controller";
import "./globals.css";

export const metadata: Metadata = {
  title: "StormBridge AI",
  description: "Weather intelligence and disaster preparedness for connected and offline communities.",
};

const themeScript = `
(() => {
  try {
    const raw = localStorage.getItem("stormbridge:settings");
    const theme = raw ? (JSON.parse(raw).appearance?.theme || "dark") : "dark";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = theme === "dark" || (theme === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  } catch {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

const navItems: Array<[string, string, LucideIcon]> = [
  ["Overview", "/", LayoutDashboard],
  ["Analyze Risk", "/check", CloudSun],
  ["Community Reports", "/report", FileWarning],
  ["Responder Command", "/dashboard", BarChart3],
  ["Offline Guidance", "/offline", WifiOff],
  ["Settings", "/settings", Settings],
];

const mobileActions: Array<[string, string, LucideIcon]> = [
  ["Check", "/check", CloudSun],
  ["Report", "/report", FileWarning],
  ["Offline", "/offline", WifiOff],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
            <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 px-3 py-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/[0.76] sm:px-4 sm:py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white lg:hidden">
                  <ShieldAlert size={20} />
                  StormBridge
                </Link>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 lg:hidden">Online</span>
                <div className="hidden items-center gap-2 text-sm lg:flex">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">System online</span>
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">Last sync: live</span>
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">Active alerts: monitored</span>
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">Offline ready</span>
                </div>
              </div>
              <nav className="mt-2 flex gap-1 overflow-x-auto text-sm lg:hidden">
                {navItems.map(([label, href]) => (
                  <Link key={String(href)} href={String(href)} className="whitespace-nowrap rounded-full px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06] sm:px-3 sm:py-2">
                    {label}
                  </Link>
                ))}
              </nav>
            </header>
            {children}
            <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-1 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 lg:hidden">
              {mobileActions.map(([label, href, Icon]) => (
                <Link key={href} href={href} className="flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.06]">
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </body>
    </html>
  );
}
