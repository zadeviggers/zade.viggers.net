import {
	createNotificationManager,
	NotificationManager,
} from "simple-vanilla-notifications";
import {
	For,
	Match,
	Switch,
	createEffect,
	createResource,
	createSignal,
	onCleanup,
} from "solid-js";

type Letter = string;
const threshold = 5;
export default function WordleSolver() {
	const [greyLetters, setGreyLetters] = createSignal<Letter[]>([]);
	const [yellowLetters, setYellowLetters] = createSignal<Letter[]>([]);
	const [greenLetters, setGreenLetters] = createSignal<Letter[]>([]);
	const [possibleWords, setPossibleWords] = createSignal<string[]>([]);
	const [notificationManager, setNotificationManager] =
		createSignal<NotificationManager>();

	createEffect(() => {
		setNotificationManager(
			createNotificationManager({
				defaultTimeout: 5000,
			}),
		);
	});

	onCleanup(() => notificationManager().destroyAllNotifications());

	const [words, { refetch }] = createResource(notificationManager, async () => {
		const loadingNotification = notificationManager().createNotification(
			"Loading wordlist...",
			{
				dismissible: false,
				timeout: false,
			},
		);
		try {
			const data = await fetch("/five-letter-words.txt");
			const text = await data.text();
			loadingNotification.destroy();
			notificationManager().createNotification("Loaded wordlist");
			return text.split("\n");
		} catch (error) {
			loadingNotification.destroy();
			notificationManager().createNotification(
				`Failed to load wordlist: ${error}`,
				{
					timeout: false,
				},
			);
		}
	});

	const totalLength = () =>
		greyLetters().length + yellowLetters().length + greenLetters().length;

	createEffect(() => {
		if (totalLength() >= 5) {
			const requiredLetters = [
				...yellowLetters(),
				...greenLetters().filter((l) => l !== "?"),
			];
			console.log(requiredLetters);
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
		}
	});

	return (
		<div class="flow">
			<Switch
				fallback={<p>Something broke</p>}
				children={
					<>
						<Match
							when={words.loading}
							children={<p>Loading wordlist....</p>}
						/>
						<Match
							when={words.error}
							children={
								<>
									{" "}
									<p>Error loading wordlist!</p>
									<pre>{words.error}</pre>
								</>
							}
						/>
						<Match
							when={!words.loading && !words.error}
							children={
								<div class="stack  flow">
									<p>
										Enter at least {threshold} total letters to see suggestions.
									</p>
									<label for="greyed-out-letters">
										<input
											id="greyed-out-letters"
											type="text"
											pattern="[a-zA-Z]+"
											value={greyLetters().join("")}
											onInput={(e) =>
												setGreyLetters(
													((e.target as HTMLInputElement).value as string)
														.trim()
														.toUpperCase()
														.split(""),
												)
											}
										/>{" "}
										Greyed out letters
									</label>
									<label for="yellow-letters">
										<input
											id="yellow-letters"
											type="text"
											pattern="^[a-zA-Z]$"
											value={yellowLetters().join("")}
											onInput={(e) =>
												setYellowLetters(
													((e.target as HTMLInputElement).value as string)
														.trim()
														.toUpperCase()
														.split(""),
												)
											}
										/>{" "}
										Yellow letters
									</label>
									<label for="green-letters">
										<input
											id="green-letters"
											type="text"
											placeholder="W??DS"
											pattern="^[a-zA-Z\?]{0,5}$"
											maxlength={5}
											value={greenLetters().join("")}
											onInput={(e) =>
												setGreenLetters(
													((e.target as HTMLInputElement).value as string)
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
										Possible words
										{possibleWords().length > 0 &&
											` (${possibleWords().length})`}
										:
									</h2>
									<p>
										More common words will generally be higher up in the list
									</p>
									<ul>
										<For
											each={possibleWords()}
											fallback={
												totalLength() < threshold ? (
													<>
														<li>
															Enter at least {threshold} characters to see
															suggestions.
														</li>
														<li>Need an opening word?</li>
														<li>
															I suggest <span class="code">ADIEU</span>.
														</li>
													</>
												) : (
													<li>No words found :(</li>
												)
											}
											children={(word, index) => (
												<li data-index={index()}>{word}</li>
											)}
										/>
									</ul>
								</div>
							}
						/>
					</>
				}
			/>
			<button onClick={refetch}>Reload wordlist</button>
		</div>
	);
}
