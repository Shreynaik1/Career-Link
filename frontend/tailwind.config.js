import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			boxShadow: {
				"soft-card": "0 18px 45px rgba(15, 23, 42, 0.09)",
			},
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				careerlink: {
					primary: "#0A66C2", // Brand Blue
					secondary: "#FFFFFF", // White
					accent: "#7FC15E", // Accent Green
					neutral: "#000000", // Black (for text)
					"base-100": "#F3F2EF", // Light Gray (background)
					info: "#5E5E5E", // Dark Gray (for secondary text)
					success: "#057642", // Dark Green (for success messages)
					warning: "#F5C75D", // Yellow (for warnings)
					error: "#CC1016", // Red (for errors)
				},
				careerlinkDark: {
					primary: "#0A66C2",
					secondary: "#020617",
					accent: "#22c55e",
					neutral: "#e5e7eb",
					"base-100": "#020617",
					info: "#9ca3af",
					success: "#22c55e",
					warning: "#eab308",
					error: "#f97373",
				},
			},
		],
	},
};
