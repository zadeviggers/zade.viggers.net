import { defineCollection, z } from "astro:content";

const interestingThingsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		order: z.number(),
	}),
});

export const collections = {
	["interesting-things"]: interestingThingsCollection,
};
