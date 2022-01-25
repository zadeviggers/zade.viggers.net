const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const allWords = readFileSync(join(__dirname, "all-words.txt"), "utf8");

const fiveLetterWords = allWords
	.split("\n")
	.map((w) => w.trim().toUpperCase())
	.filter((w) => w.length === 5)
	.join(",");

writeFileSync(
	join(__dirname, "..", "public", "five-letter-words.txt"),
	fiveLetterWords,
);
