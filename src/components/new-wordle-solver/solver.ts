import { css, html, LitElement } from "lit";

import { customElement, property, state } from "lit/decorators.js";

import { repeat } from "lit/directives/repeat.js";
import type { Colour, FilterData } from "./shared";

@customElement("wordle-solver")
export default class WordleSolver extends LitElement {
	static override styles = css`
		.words-stack {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}
		.word-row {
			display: flex;
			gap: 3px;
		}
	`;

	@state()
	filteredWords: string[] = [];

	@state()
	activeInput = { wordIndex: 0, letterIndex: 0 };

	@state()
	filteringInfo: FilterData = {};

	@state()
	currentlyFiltering: boolean | string = false;

	@state()
	currentlyLoadingWordlist: boolean | string = true;

	filteringWorker: Worker | null = null;

	override render() {
		return html`<section class="words-stack">
				${repeat(
					[0, 1, 2, 3, 4],
					(w) => w,
					(wordIndex) =>
						html`<div class="word-row">
							${repeat(
								[0, 1, 2, 3, 4],
								(l) => l,
								(letterIndex) => html` <wordle-letter-selector
									word-index="${wordIndex}"
									letter-index="${letterIndex}"
									.active=${this.activeInput.letterIndex === letterIndex &&
									this.activeInput.wordIndex === wordIndex}
									@change=${this._handleLetterChange}
									@keyup=${this._handleKeyUp}
								></wordle-letter-selector>`,
							)}
						</div>`,
				)}
			</section>
			<section>
				<h2 class="text-12xl">Word suggestions</h2>
				<p>
					${typeof this.currentlyLoadingWordlist === "string"
						? this.currentlyLoadingWordlist
						: this.currentlyLoadingWordlist === true
						? "Loading word list..."
						: "Word list loaded."}
					<br />
					${this.currentlyFiltering
						? "Currently filtering word list..."
						: "Not currently filtering word list."}
				</p>
				<ul>
					${repeat(
						this.filteredWords,
						(item) => item,
						(item) => html`<li>${item.toUpperCase()}</li>`,
					)}
				</ul>
			</section>`;
	}

	override connectedCallback(): void {
		super.connectedCallback();

		// Spawn worker
		const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
		if (
			!window.Worker ||
			// @ts-expect-error: import.meta.env isn't typed properly for some reason
			(import.meta.env.MODE === "development" && isFirefox)
		) {
			if (isFirefox)
				console.warn(
					"Vite currently only supports using web workers in dev mode in chrome - firefox doesn't work :(",
				);
			// TODO: Either: (A) Add UI when this is the case OR (B) Make it do the filtering on the main thread.
			console.warn("<<!!>> Workers are not available! <<!!>>");
		} else {
			this.filteringWorker = new Worker(
				new URL("./worker.ts", import.meta.url),
				{
					type: "module",
				},
			);
			this.filteringWorker.addEventListener("message", (e) => {
				switch (e.data?.msg) {
					case "filtered-words": {
						if (e.data?.data) {
							const words = e.data?.data;
							if (words) this.filteredWords = words;
						}
						break;
					}
					case "started-filtering-words": {
						this.currentlyFiltering = true;
						break;
					}
					case "done-filtering-words": {
						this.currentlyFiltering = false;
						break;
					}
					case "started-loading-wordlist": {
						this.currentlyLoadingWordlist = true;
						break;
					}
					case "done-loading-wordlist": {
						this.currentlyLoadingWordlist = false;
						break;
					}
					case "failed-loading-wordlist": {
						this.currentlyLoadingWordlist = `An error occurred loading the wordlist${
							e.data?.data ? `: ${e.data?.data}` : "."
						}`;
					}
				}
			});
		}
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();

		// Terminate worker
		this.filteringWorker?.terminate();
	}

	_sendFilteringIntoToWorker() {
		if (!this.filteringWorker)
			return console.warn(
				"Worker not found, but filtering data has been inputted",
			);

		// This object gets cloned rather than transferred
		this.filteringWorker.postMessage({
			msg: "filter-info",
			data: this.filteringInfo,
		});
	}

	private _handleKeyUp(e: KeyboardEvent) {
		const letterSelector = e.currentTarget as LetterSelector;
		if (e.code === "Backspace" && letterSelector.letter === "") {
			const wordIndex = Number(letterSelector.getAttribute("word-index"));
			const letterIndex = Number(letterSelector.getAttribute("letter-index"));

			let nextWordIndex = wordIndex;
			let nextLetterIndex = letterIndex;

			// When the user backspaces with an empty cell, send them back 1 cell
			if (letterIndex === 0) {
				// If this is the last letter
				if (wordIndex !== 0) {
					// Make sure this isn't the last word
					nextWordIndex = wordIndex - 1;
					nextLetterIndex = 4;
				}
			} else {
				// If this isn't the last letter
				nextLetterIndex = letterIndex - 1;
			}

			this.activeInput = {
				wordIndex: nextWordIndex,
				letterIndex: nextLetterIndex,
			};
		}
	}

	_handleLetterChange(e: CustomEvent<LetterSelector>) {
		const wordIndex = Number(
			(e.target as HTMLInputElement).getAttribute("word-index"),
		);
		const letterIndex = Number(
			(e.target as HTMLInputElement).getAttribute("letter-index"),
		);

		const letter = (e?.target as LetterSelector).letter;
		const colour = (e?.target as LetterSelector).colour;

		// Make sure it's defined
		this.filteringInfo[wordIndex] ||= {};
		// Update the filtering info
		this.filteringInfo[wordIndex]![letterIndex] = { letter, colour };
		// Send updates to worker
		this._sendFilteringIntoToWorker();

		if (letter !== "") {
			let nextWordIndex = wordIndex;
			let nextLetterIndex = letterIndex;
			// If not the last word
			if (letterIndex === 4) {
				// If this is the last letter
				if (wordIndex !== 4) {
					// Make sure this isn't the last word
					nextWordIndex = wordIndex + 1;
					nextLetterIndex = 0;
				}
			} else {
				// If this isn't the last letter
				nextLetterIndex = letterIndex + 1;
			}

			this.activeInput = {
				wordIndex: nextWordIndex,
				letterIndex: nextLetterIndex,
			};
		}
	}
}

@customElement("wordle-letter-selector")
export class LetterSelector extends LitElement {
	@state()
	public letter = "";

	@state()
	public colour: Colour = "grey";

	@property({ type: Number })
	["word-index"] = 0;

	@property({ type: Number })
	["letter-index"] = 0;

	@property({ type: Boolean, reflect: true })
	active = false;

	private inputEl: HTMLInputElement | null = null;

	static override styles = css`
		:host {
			display: flex;
			flex-direction: column;
			width: 80px;
			height: 80px;
			--grey: lightgrey;
			--yellow: gold;
			--green: lime;
		}
		:host([data-colour="grey"]) {
			background-color: var(--grey);
		}
		:host([data-colour="yellow"]) {
			background-color: var(--yellow);
		}
		:host([data-colour="green"]) {
			background-color: var(--green);
		}
		input {
			text-transform: uppercase;
			border: 0;
			margin: 0;
			padding: 0;
			background: transparent;
			text-align: center;
			flex: 2;
			font-weight: bold;
			font-family: sans-serif;
			font-size: 24pt;
		}
		.button-row {
			display: flex;
			/* justify-content: ; */
			align-items: flex-end;
			flex: 1;
			--border-spacing: 5px;
		}
		button {
			border: var(--border-spacing) solid transparent;
			padding: 0;
			margin: 0;
			flex: 1;
			background: rgba(0, 0, 0, 0.2);
			user-select: none;
		}
		button:first-child {
			padding-left: var(--border-spacing);
		}
		button:last-child {
			padding-right: var(--border-spacing);
		}
		button:hover {
			background: rgba(0, 0, 0, 0.6);
		}
	`;

	override render() {
		return html`<input
				@input=${this._handleInput}
				maxlength="1"
				pattern="[a-z]|[A-Z]"
				class="letter-input"
				title="Enter a letter"
			/>
			<div class="button-row">
				<button
					class="beans"
					data-colour="grey"
					title="Set as Grey"
					@click=${this._handleColourClick}
				>
					⬜️
				</button>
				<button
					data-colour="yellow"
					title="Set as Yellow"
					@click=${this._handleColourClick}
				>
					🟨
				</button>
				<button
					data-colour="green"
					title="Set as Green"
					@click=${this._handleColourClick}
				>
					🟩
				</button>
			</div>`;
	}

	override connectedCallback() {
		super.connectedCallback();

		this._updateColourAttribute();
		this.inputEl = this.renderRoot?.querySelector("input.letter-input");
	}

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	protected override update(_whatever: any) {
		super.update(_whatever);

		if (this.active) {
			this.inputEl?.focus();
		}
	}

	private _handleInput(e: InputEvent) {
		this.letter = (e.target as HTMLInputElement).value;
		this._dispatchChange();
	}

	private _updateColour(colour: Colour) {
		// if (this.colour !== colour) {
		this.colour = colour;
		this._updateColourAttribute();
		this._dispatchChange();
		// }
	}

	private _handleColourClick(e: MouseEvent) {
		const colour = (e.target as HTMLButtonElement).dataset.colour as Colour;
		this._updateColour(colour);
	}

	private _updateColourAttribute() {
		this.dataset.colour = this.colour;
	}

	private _dispatchChange() {
		const event = new CustomEvent("change", { bubbles: true, composed: true });
		this.dispatchEvent(event);
	}
}
