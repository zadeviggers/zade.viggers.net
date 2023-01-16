import type { Colour, FilterData } from "./shared";

let wordList: string[] = [];
let filterData: FilterData = {};

self.addEventListener("message", (e) => {
	if (e.data.msg === "filter-info" && !!e.data.data) {
		filterData = e.data.data;
		startFiltering();
	}
});

function startFiltering() {
	self.postMessage({
		msg: "filtered-words",
		data: wordList,
	});
}

const res = await fetch("/five-letter-words.txt");
const data = await res.text();
wordList = data.split("\n");

export {};
