import { css, html, LitElement } from "lit";

import { customElement, property, state } from "lit/decorators.js";

import { repeat } from "lit/directives/repeat.js";

type Colour = "grey" | "yellow" | "green";

@customElement("wordle-solver")
export default class WordleSolver extends LitElement {
	@state()
	filteredWords: string[] = ["beans", "words"];

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

	override render() {
		function makeHandleLetterChange(wordIndex: number, letterIndex: number) {
			return (e: unknown) => console.log(e, wordIndex, letterIndex);
		}
		return html`<section class="words-stack">
				${repeat(
					[0, 1, 2, 3, 4],
					(wordIndex) =>
						html`<div class="word-row">
							${repeat(
								[0, 1, 2, 3, 4],
								(letterIndex) => html` <wordle-letter-selector
									@change=${makeHandleLetterChange(wordIndex, letterIndex)}
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
}

@customElement("wordle-letter-selector")
export class LetterSelector extends LitElement {
	@state()
	letter = "";

	@state()
	colour: Colour = "grey";

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
			/>
			<div class="button-row">
				<button
					data-colour="grey"
					title="Set as Grey"
					@click=${() => this._updateColour("grey")}
				>
					⬜️
				</button>
				<button
					data-colour="yellow"
					title="Set as Yellow"
					@click=${() => this._updateColour("yellow")}
				>
					🟨
				</button>
				<button
					data-colour="green"
					title="Set as Green"
					@click=${() => this._updateColour("green")}
				>
					🟩
				</button>
			</div>`;
	}

	override connectedCallback() {
		super.connectedCallback();
		this._updateColourAttribute();
	}

	private _handleInput(e: InputEvent) {
		this.letter = (e.target as HTMLInputElement).value;
		this._dispatchChange();
	}

	private _updateColour(colour: Colour) {
		this.colour = colour;
		this._updateColourAttribute();
		this._dispatchChange();
	}

	private _updateColourAttribute() {
		this.dataset.colour = this.colour;
	}

	private _dispatchChange() {
		const event = new CustomEvent("change");
		this.dispatchEvent(event);
	}
}
