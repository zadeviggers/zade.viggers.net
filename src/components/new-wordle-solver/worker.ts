import type { Colour, FilterData } from "./shared";

let wordList: string[] = [];
let filterData: FilterData = {};

let filterController: AbortController | undefined;

self.addEventListener("message", (e) => {
	switch (e.data.msg) {
		case "filter-info": {
			if (!e.data.data) return;
			filterController?.abort("New filtering data arrived.");
			filterData = e.data.data;
			filterController = new AbortController();
			startFiltering(filterController.signal);
			break;
		}
		case "reload-words": {
			loadWordlist();
			break;
		}
	}
});

function startFiltering(signal: AbortSignal) {
	if (wordList.length === 0)
		return self.postMessage({
			msg: "still-loading-wordlist",
		});

	const filterWords = Object.values(filterData)
		.map((word) => Object.values(word).filter((v) => v.letter !== ""))
		.filter((word) => word.length > 0);

	if (filterWords.length === 0)
		return self.postMessage({
			msg: "no-filter-data",
		});

	const possibleWords: string[] = [];

	self.postMessage({
		msg: "started-filtering-words",
	});

	for (const word of wordList) {
		// Allow aborting during the filtering process
		if (signal.aborted) return;

		let failed = false;

		for (const filterWord of filterWords) {
			for (let i = 0; i < word.length; i++) {
				const letter = word[i];
				const filterLetter = filterWord[i];

				if (!filterLetter) {
					// Skip this iteration if there's no filter letter
					continue;
				}

				// Colour matching
				if (filterLetter.colour === "green") {
					if (letter !== filterLetter.letter) {
						failed = true;
					}
				} else if (filterLetter.colour === "grey") {
				} else if (filterLetter.colour === "yellow") {
				}
			}
		}

		if (!failed) {
			possibleWords.push(word);
		}
	}

	self.postMessage({
		msg: "done-filtering-words",
	});

	if (signal.aborted) return;
	self.postMessage({
		msg: "filtered-words",
		data: possibleWords,
	});
}

async function loadWordlist() {
	try {
		self.postMessage({
			msg: "started-loading-wordlist",
		});
		const res = await fetch("/five-letter-words.txt");
		const data = await res.text();
		wordList = data.split("\n");
		self.postMessage({
			msg: "done-loading-wordlist",
		});
	} catch (err) {
		self.postMessage({
			msg: "failed-loading-wordlist",
			data: err,
		});
	}
}

loadWordlist();

export {};
