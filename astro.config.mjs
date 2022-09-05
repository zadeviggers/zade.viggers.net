import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import beep from "astro-beep";

// https://astro.build/config
export default defineConfig({
	integrations: [
		solid(),
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
		mdx(),
		beep({ mode: "blastoff" }),
	],
});
