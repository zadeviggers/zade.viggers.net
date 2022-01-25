import {
	For,
	Match,
	Switch,
	createEffect,
	createResource,
	createSignal,
} from "solid-js";

type Letter = string;

export default function WordleSolver() {
	const [greyLetters, setGreyLetters] = createSignal<Letter[]>([]);
	const [yellowLetters, setYellowLetters] = createSignal<Letter[]>([]);
	const [greenLetters, setGreenLetters] = createSignal<Letter[]>([]);
	const [possibleWords, setPossibleWords] = createSignal<string[]>([]);
	const [words] = createResource(async () => {
		const data = await fetch("/five-letter-words.txt");
		const text = await data.text();
		return text.split(",");
	});

	createEffect(() => {
		if (
			greyLetters().length + yellowLetters().length + greenLetters().length >=
			3
		) {
			const greyFiltered = words().filter((word) => {
				if (greyLetters().find((letter) => word.includes(letter))) return false;
				return true;
			});
			const yellowFiltered = greyFiltered.filter((word) => {
				if (
					yellowLetters().filter((letter) => word.includes(letter)).length ===
					yellowLetters().length
				)
					return true;
				return false;
			});
			const greenFiltered = yellowFiltered.filter((word) => {
				if (
					greenLetters().filter((letter, i) =>
						letter === "?" ? true : word[i] === letter,
					).length === greenLetters().length
				)
					return true;
				return false;
			});
			setPossibleWords(greenFiltered);
		}
	});

	return (
		<Switch fallback={<p>Something broke</p>}>
			<Match when={words.loading}>
				<p>Loading wordlist....</p>
			</Match>
			<Match when={words.error}>
				<p>Error loading wordlist!</p>
				<pre>{words.error}</pre>
			</Match>
			<Match when={!words.loading && !words.error}>
				<div class="stack">
					<p>Enter at least 3 total letters to see suggestions.</p>
					<label for="greyed-out-letters">
						<input
							id="greyed-out-letters"
							type="text"
							regexp="[a-zA-Z]+"
							value={greyLetters().join("")}
							onInput={(e) =>
								setGreyLetters(
									(e.target.value as string).trim().toUpperCase().split(""),
								)
							}
						/>{" "}
						Greyed out letters
					</label>
					<label for="yellow-letters">
						<input
							id="yellow-letters"
							type="text"
							regexp="^[a-zA-Z]{0,5}$"
							maxlength={5}
							value={yellowLetters().join("")}
							onInput={(e) =>
								setYellowLetters(
									(e.target.value as string)
										.trim()
										.toUpperCase()
										.split("")
										.slice(0, 5),
								)
							}
						/>{" "}
						Yellow letters
					</label>
					<label for="green-letters">
						<input
							id="green-letters"
							type="text"
							placeholder="W??DLE"
							regexp="^[a-zA-Z\?]{0,5}$"
							maxlength={5}
							value={greenLetters().join("")}
							onInput={(e) =>
								setGreenLetters(
									(e.target.value as string)
										.trim()
										.toUpperCase()
										.split("")
										.slice(0, 5),
								)
							}
						/>{" "}
						Green letters (In order. Put a "?" for unknown letters.)
					</label>
					<hr />
					<h2>
						Posible words
						{possibleWords().length > 0 && ` (${possibleWords().length})`}:
					</h2>
					<ul>
						<For each={possibleWords()} fallback={<li>No words found :(</li>}>
							{(word, index) => <li data-index={index()}>{word}</li>}
						</For>
					</ul>
				</div>
			</Match>
		</Switch>
	);
}
