import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import beep from "astro-beep";
import compress from "astro-compress";

export default defineConfig({
	integrations: [
		solid(),
		tailwind(),
		mdx(),
		compress(),
		beep({
			mode: "blastoff",
		}),
	],
});
