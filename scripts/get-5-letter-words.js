const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

console.info("Started!");

const allWords = readFileSync(join(__dirname, "all-words.txt"), "utf8").split(
	"\n",
);

const commonWords = readFileSync(join(__dirname, "count_1w.txt"), "utf8")
	.split("\n")
	.map((w) => {
		const match = w.match(/([a-z]+)\s([0-9]+)/);
		if (match === null) return null;
		return match[1];
	})
	.filter((w) => w !== null);

console.info("Loaded words!");

const fiveLetterWords = allWords
	.map((w) => w.trim().toUpperCase())
	.filter((w) => w.length === 5);

const common5LetterWords = commonWords
	.map((w) => w.trim().toUpperCase())
	.filter((w) => w.length === 5);

console.info("Filtered out non-5-letter words!");

const sortedWords = fiveLetterWords.sort((a, b) => {
	const commonIndexA = common5LetterWords.indexOf(a);
	const commonIndexB = common5LetterWords.indexOf(b);
	if (commonIndexA === -1 && commonIndexB === -1) {
		return 0;
	} else if (commonIndexA !== -1 && commonIndexB === -1) {
		return -1;
	} else if (commonIndexA === -1 && commonIndexB !== -1) {
		return 1;
	}
	return commonIndexA - commonIndexB;
});

console.info("Sorted words!");

writeFileSync(
	join(__dirname, "..", "public", "five-letter-words.txt"),
	sortedWords.join("\n"),
);

console.info("Done!");
