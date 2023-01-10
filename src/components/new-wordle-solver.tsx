import { createEffect, createResource, createSignal, For } from "solid-js";

type Colour = "grey" | "yellow" | "green";

type Letter = {
	colour: Colour;
	value?: string;
};

type Word = [Letter, Letter, Letter, Letter, Letter];

function LetterInput({
	onChange,
	value,
}: {
	onChange: (newValue: Letter) => void;
	value: Letter;
}) {
	const makeSetColour = (colour: Colour) => {
		return () => {
			console.log(colour);
			const newValue = { ...value };
			newValue.colour = colour;
			onChange(newValue);
		};
	};

	return (
		<div
			class="w-20 h-20"
			classList={{
				"bg-zinc-200": value.colour === "grey",
				"bg-yellow-400": value.colour === "yellow",
				"bg-lime-500": value.colour === "green",
			}}
		>
			<input
				value={value.value ?? ""}
				onInput={(e) => {
					const newValue = { ...value };
					newValue.value = e.target.value;
					onChange(newValue);
				}}
				type="text"
				maxLength={1}
				class="w-full h-[70%] bg-transparent border-none text-center uppercase text-5xl"
			/>
			<div class="flex justify-around items-start h-[20%]">
				<button title="Set as Grey" onClick={makeSetColour("grey")}>
					⬜️
				</button>
				<button title="Set as Yellow" onClick={makeSetColour("yellow")}>
					🟨
				</button>
				<button title="Set as Green" onClick={makeSetColour("green")}>
					🟩
				</button>
			</div>
		</div>
	);
}

function WordInput({
	onChange,
	value,
}: {
	onChange: (newValue: Word) => void;
	value: Word;
}) {
	const makeUpdateLetter = (index: number) => {
		return (newValue: Letter) => {
			const newWord: typeof value = [...value];
			newWord[index] = newValue;
			onChange(newWord);
		};
	};

	return (
		<div class="flex gap-2">
			<For each={value}>
				{(letter, i) => (
					<LetterInput value={letter} onChange={makeUpdateLetter(i())} />
				)}
			</For>
		</div>
	);
}

const initialEnteredWords: [Word, Word, Word, Word, Word] = [
	[
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
	],
	[
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
	],
	[
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
	],
	[
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
	],
	[
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
		{ colour: "grey" },
	],
];

export default function WordleSolver() {
	const [wordList, { refetch }] = createResource(async () =>
		(await (await fetch("/five-letter-words.txt")).text()).split("\n"),
	);

	const [enteredWords, setEnteredWords] =
		createSignal<typeof initialEnteredWords>(initialEnteredWords);

	const makeUpdateWord = (index: number) => {
		return (newValue: Word) => {
			const newWords: ReturnType<typeof enteredWords> = [...enteredWords()];
			newWords[index] = newValue;
			setEnteredWords(newWords);
		};
	};

	return (
		<>
			<section id="words-input" class="flex mt-2 mb-2 flex-col gap-2">
				<For each={enteredWords()}>
					{(word, i) => (
						<WordInput value={word as Word} onChange={makeUpdateWord(i())} />
					)}
				</For>
			</section>
			<ul id="sugegstions"></ul>
			<button onClick={refetch} disabled={wordList.loading} class="button">
				Refetch wordlist
			</button>
		</>
	);
}
