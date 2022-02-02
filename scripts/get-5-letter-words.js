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
[].sort();
writeFileSync(
	join(__dirname, "..", "public", "five-letter-words.txt"),
	sortedWords.join("\n"),
);
