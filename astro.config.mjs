import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import beep from "astro-beep";

export default defineConfig({
	integrations: [
		solid(),
		tailwind(),
		mdx(),
		beep({
			mode: "blastoff",
		}),
	],
	devToolbar: {
		enabled: false,
	},
});
