import { css, html, LitElement } from "lit";

import { customElement, property, state } from "lit/decorators.js";

import { repeat } from "lit/directives/repeat.js";

type Colour = "grey" | "yellow" | "green";

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
	filteredWords: string[] = ["beans", "words"];

	@state()
	activeInput = { wordIndex: 0, letterIndex: 0 };

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
									@change=${this._makeHandleLetterChange(
										wordIndex,
										letterIndex,
									)}
								></wordle-letter-selector>`,
							)}
						</div>`,
				)}
			</section>
			<section>
				<h2 class="text-12xl">Word suggestions</h2>
				<ul>
					${repeat(
						this.filteredWords,
						(item) => item,
						(item) => html`<li>${item.toUpperCase()}</li>`,
					)}
				</ul>
			</section>`;
	}

	_makeHandleLetterChange(wordIndex: number, letterIndex: number) {
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

		return (e: CustomEvent<LetterSelector>) => {
			const letter = (e?.target as LetterSelector).letter;
			console.log(wordIndex, letterIndex, letter);

			if (letter !== "") {
				this.activeInput = {
					wordIndex: nextWordIndex,
					letterIndex: nextLetterIndex,
				};
			}
		};
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
					@click=${this._makeHandleColourClick("grey")}
				>
					⬜️
				</button>
				<button
					data-colour="yellow"
					title="Set as Yellow"
					@click=${this._makeHandleColourClick("yellow")}
				>
					🟨
				</button>
				<button
					data-colour="green"
					title="Set as Green"
					@click=${this._makeHandleColourClick("green")}
				>
					🟩
				</button>
			</div>`;
	}

	override connectedCallback() {
		super.connectedCallback();
		this._updateColourAttribute();
	}

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	protected override update(_whatever: any) {
		super.update(_whatever);

		if (this.active) {
			if (!this.inputEl) {
				this.inputEl = this.renderRoot?.querySelector("input.letter-input");
				this.inputEl?.focus();
			}
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

	private _makeHandleColourClick(colour: Colour) {
		return () => this._updateColour(colour);
	}

	private _updateColourAttribute() {
		this.dataset.colour = this.colour;
	}

	private _dispatchChange() {
		const event = new CustomEvent("change", { bubbles: true, composed: true });
		this.dispatchEvent(event);
	}
}
