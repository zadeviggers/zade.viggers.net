module.exports = {
	useTabs: true,
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	bracketSpacing: true,
	jsxBracketSameLine: true,
	arrowParens: "always",
	proseWrap: "always",
	plugins: [require.resolve("prettier-plugin-astro")],
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};
