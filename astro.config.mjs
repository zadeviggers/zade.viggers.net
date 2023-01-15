import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import beep from "astro-beep";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
import lit from "@astrojs/lit";

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
		compress(),
		beep({
			mode: "blastoff",
		}),
		lit(),
	],
});
