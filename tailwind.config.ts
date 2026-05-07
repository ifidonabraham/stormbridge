import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        emergency: {
          ink: "#101316",
          muted: "#667085",
          field: "#f6f7f9",
          panel: "#ffffff",
          line: "#e5e7eb",
          green: "#0f9f6e",
          amber: "#b7791f",
          orange: "#e25822",
          red: "#c0262d",
        },
      },
      boxShadow: {
        panel: "0 18px 50px rgba(15, 23, 42, 0.08)",
        soft: "0 8px 24px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
