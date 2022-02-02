const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const allWords = readFileSync(join(__dirname, "all-words.txt"), "utf8");
const commonWords = readFileSync(
	join(__dirname, "google-10000-english.txt"),
	"utf8",
);

const fiveLetterWords = allWords
	.split("\n")
	.map((w) => w.trim().toUpperCase())
	.filter((w) => w.length === 5);

const common5LetterWords = commonWords
	.split("\n")
	.map((w) => w.trim().toUpperCase())
	.filter((w) => w.length === 5);

const sortedWords = fiveLetterWords; /*fiveLetterWords.sort((a, b) => {
	const commonIndexA = common5LetterWords.indexOf(a);
	const commonIndexB = common5LetterWords.indexOf(b);
	if (commonIndexA === undefined && commonIndexB === undefined) {
		return 0;
	} else if (commonIndexA !== undefined && commonIndexB === undefined) {
		return 1;
	} else if (commonIndexA === undefined && commonIndexB !== undefined) {
		return -1;
	}
	if (commonIndexA < commonIndexB) {
		return -1;
	} else if (commonIndexA > commonIndexB) {
		return 1;
	}
	return 0;
});*/

writeFileSync(
	join(__dirname, "..", "public", "five-letter-words.txt"),
	sortedWords.join("\n"),
);
