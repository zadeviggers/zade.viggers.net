const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				// theme: colors.lime,
				theme: "var(--theme)",
				"theme-contrast": "var(--theme-contrast)",
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						a: {
							"text-decoration-color": theme("colors.theme"),
						},
					},
				},
			}),
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
