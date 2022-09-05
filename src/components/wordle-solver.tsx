import {
	createNotificationManager,
	NotificationManager,
} from "simple-vanilla-notifications";
import {
	For,
	createEffect,
	createResource,
	createSignal,
	onCleanup,
} from "solid-js";

const threshold = 2;
export default function WordleSolver() {
	const [greyLettersInput, setGreyLettersInput] =
		createSignal<HTMLInputElement | null>(null);
	const [yellowLettersInput, setYellowLettersInput] =
		createSignal<HTMLInputElement | null>(null);
	const [greenLettersInput, setGreenLettersInput] =
		createSignal<HTMLInputElement | null>(null);

	const [possibleWords, setPossibleWords] = createSignal<string[]>([]);
	const [notificationManager, setNotificationManager] =
		createSignal<NotificationManager>();

	const greenLetters = () =>
		greenLettersInput()?.value.toUpperCase().split("") || [];
	const yellowLetters = () =>
		yellowLettersInput()?.value.toUpperCase().split("") || [];
	const greyLetters = () =>
		greyLettersInput()?.value.toUpperCase().split("") || [];

	createEffect(() => {
		setNotificationManager(createNotificationManager());
	});

	onCleanup(() => {
		notificationManager().dismissAllNotifications();
		setTimeout(() => notificationManager().destroy(), 1000);
	});

	const [words, { refetch }] = createResource(notificationManager, async () => {
		const loadingNotification = notificationManager().createNotification(
			"Loading wordlist...",
			{
				dismissible: false,
				autoDismissTimeout: -1,
			},
		);
		try {
			const data = await fetch("/five-letter-words.txt");
			const text = await data.text();
			loadingNotification.dismiss();
			notificationManager().createNotification("Loaded wordlist");
			return text.split("\n");
		} catch (error) {
			loadingNotification.dismiss();
			notificationManager().createNotification(
				`Failed to load wordlist: ${error}`,
			);
		}
	});

	const totalLength = () =>
		greyLetters().length + yellowLetters().length + greenLetters().length;

	function handleChange() {
		console.log(totalLength());
		console.log(greyLetters(), yellowLetters(), greenLetters());

		if (totalLength() >= threshold) {
			const requiredLetters = [
				...yellowLetters(),
				...greenLetters().filter((l) => l !== "?"),
			];
			const greyFiltered =
				greyLetters().length === 0
					? words()
					: words().filter((word) => {
							if (
								greyLetters()
									.filter((letter) => !requiredLetters.includes(letter))
									.find((letter) => {
										if (word.includes(letter)) {
											return true;
										} else {
											return false;
										}
									})
							) {
								return false;
							} else {
								return true;
							}
					  });
			const yellowFiltered =
				yellowLetters().length === 0
					? greyFiltered
					: greyFiltered.filter((word) => {
							if (
								requiredLetters.filter((letter) => word.includes(letter))
									.length === requiredLetters.length
							) {
								return true;
							} else {
								return false;
							}
					  });
			const greenFiltered =
				greenLetters().length === 0
					? yellowFiltered
					: yellowFiltered.filter((word) => {
							if (
								greenLetters().filter((letter, i) => {
									if (letter === "?") {
										return true;
									} else if (word[i] === letter) {
										return true;
									} else {
										return false;
									}
								}).length === greenLetters().length
							)
								return true;
							return false;
					  });

			setPossibleWords(greenFiltered);
		} else {
			setPossibleWords([]);
		}
	}

	const loading = () => words.loading;

	return (
		<div class="lg:max-w-2xl">
			<div class="flex flex-col">
				<p>Enter at least {threshold} total letters to see suggestions.</p>
				<label for="greyed-out-letters">
					Greyed out letters
					<input
						class="wordle-solver-input"
						disabled={loading()}
						id="greyed-out-letters"
						type="text"
						pattern="[a-zA-Z]+"
						ref={setGreyLettersInput}
						onInput={handleChange}
					/>
				</label>
				<label for="yellow-letters">
					Yellow letters
					<input
						class="wordle-solver-input"
						disabled={loading()}
						id="yellow-letters"
						type="text"
						pattern="^[a-zA-Z]$"
						ref={setYellowLettersInput}
						onInput={handleChange}
					/>
				</label>
				<label
					for="green-letters"
					title="In order. Put a '?' for unknown letters.">
					Green letters
					<input
						class="wordle-solver-input"
						disabled={loading()}
						id="green-letters"
						type="text"
						placeholder="W??DS"
						pattern="^[a-zA-Z\?]{0,5}$"
						maxlength={5}
						ref={setGreenLettersInput}
						onInput={handleChange}
					/>{" "}
				</label>
				<h2 class="font-bold">
					Possible words
					{possibleWords().length > 0 && ` (${possibleWords().length})`}:
				</h2>
				<p class="border-l-4 pl-2 border-theme-500 rounded-md bg-theme-50 p-2">
					More common words will generally be higher up in the list.
				</p>
				<ul>
					<For
						each={possibleWords()}
						fallback={
							totalLength() <= threshold ? (
								<>
									<li class="border-l-4 pl-2 border-rose-500 rounded-md bg-rose-50 p-2 mt-2">
										Enter at least {threshold} characters to see suggestions.
									</li>
								</>
							) : (
								<li>No words found :{"("}</li>
							)
						}
						children={(word, index) => <li data-index={index()}>{word}</li>}
					/>
				</ul>
			</div>

			<button onClick={refetch} class="mt-2 button">
				Reload wordlist
			</button>
		</div>
	);
}
