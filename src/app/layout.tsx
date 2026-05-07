import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "StormBridge AI",
  description: "Weather intelligence and disaster preparedness for connected and offline communities.",
};

const navItems = [
  ["Check", "/check"],
  ["Report", "/report"],
  ["Dashboard", "/dashboard"],
  ["Offline", "/offline"],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950 dark:text-white">
              <span className="grid size-9 place-items-center rounded-2xl bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950">
                <ShieldAlert size={20} />
              </span>
              StormBridge AI
            </Link>
            <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-black/5 bg-white/60 p-1 text-sm font-medium shadow-soft dark:border-white/10 dark:bg-white/[0.04]">
              {navItems.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full px-3 py-2 text-slate-600 transition hover:bg-slate-950 hover:text-white dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-950"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
