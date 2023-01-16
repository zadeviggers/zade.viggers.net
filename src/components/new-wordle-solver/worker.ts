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

	let possibleWords: string[] = [];

	for (const word of wordList) {
		// Allow aborting during the filtering process
		if (signal.aborted) return;
	}

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
			msg: "loaded-wordlist",
		});
	} catch (err) {
		self.postMessage({
			msg: "failed-loading-wordlist",
		});
	}
}

loadWordlist();

export {};
