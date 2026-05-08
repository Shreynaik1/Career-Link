import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			boxShadow: {
				"soft-card": "0 10px 30px rgba(0, 0, 0, 0.04)",
				"premium": "0 20px 40px -10px rgba(0, 0, 0, 0.08)",
				"glow": "0 0 20px rgba(79, 70, 229, 0.15)",
			},
			borderRadius: {
				"2xl": "1rem",
				"3xl": "1.5rem",
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-out forwards",
				"slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(20px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				careerlink: {
					primary: "#4f46e5", // Modern Indigo
					secondary: "#ffffff",
					accent: "#10b981", // Emerald
					neutral: "#1e293b", // Slate 800
					"base-100": "#f8fafc", // Slate 50 (Very light gray)
					"base-200": "#f1f5f9", // Slate 100
					"base-300": "#e2e8f0", // Slate 200
					info: "#3b82f6",
					success: "#059669",
					warning: "#f59e0b",
					error: "#ef4444",
					"--rounded-box": "1.2rem",
					"--rounded-btn": "0.8rem",
				},
				careerlinkDark: {
					primary: "#6366f1",
					secondary: "#0f172a",
					accent: "#22c55e",
					neutral: "#f8fafc",
					"base-100": "#0f172a",
					"base-200": "#1e293b",
					info: "#60a5fa",
					success: "#4ade80",
					warning: "#facc15",
					error: "#f87171",
				},
			},
		],
	},
};
