export type Technology = {
	name: string;
	url: string;
	note?: string;
};

export const technologies: Record<string, Technology> = {
	Typescript: { name: "Typescript", url: "https://typescriptlang.org/" },
	MUI5: { name: "MUI", url: "https://mui.com/", note: "Version 5" },
	MUI4: { name: "MUI", url: "https://mui.com/", note: "Version 4" },
	React: { name: "React", url: "https://reactjs.org/" },
	ReactQuery: {
		name: "React-Query",
		url: "https://react-query.tanstack.com/",
	},
	ReactRouter5: {
		name: "React-Router",
		url: "reactrouter.com/",
		note: "Version 5",
	},
	ReactRouter6: {
		name: "React-Router",
		url: "reactrouter.com/",
		note: "Version 6",
	},
	MapboxGLJS: {
		name: "Mapbox GL JS",
		url: "https://mapbox.com/",
	},
	Tailwind3: {
		name: "Tailwind CSS",
		url: "https://tailwindcss.com/",
		// note: "Version 3",
	},
	Astro: {
		name: "Astro",
		url: "https://astro.build/",
	},
	NetlifyCMS: {
		name: "Netlify CMS",
		url: "https://www.netlifycms.org/",
	},
};
export type Project = {
	title: string;
	url?: string;
	comment: string;
	technologies: (keyof typeof technologies)[];
};
