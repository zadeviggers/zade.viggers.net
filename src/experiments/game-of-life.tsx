import {
	Index,
	Match,
	Show,
	Switch,
	createEffect,
	createSignal,
} from "solid-js";

export default function GameOfLife() {
	const [boardSize, setBoardSize] = createSignal(10);

	const blankBoard = () =>
		Array.from(Array(boardSize())).map(() =>
			Array.from(Array(boardSize())).map(() => false),
		);

	const [board, setBoard] = createSignal<boolean[][]>();

	const [paused, setPaused] = createSignal(true);

	function onReset() {
		setBoard(undefined), setPaused(true);
	}

	function onCellClick([x, y]) {
		console.log(`Cell ${x}, ${y} clicked (was ${board()[y][x]})!`);
		let newBoard = [...board()];
		newBoard[y][x] = board()[y][x] ? false : true;
		setBoard(newBoard);
	}

	return (
		<div class="stack">
			<Switch fallback="Something is broken.">
				<Match when={!board()}>
					<label for="board-size-slider">
						Board size{" "}
						<input
							onInput={(e) => setBoardSize(Number(e.target.value))}
							value={boardSize()}
							min={0}
							max={100}
							type="range"
							name="board-size"
							id="board-size-slider"
						/>
					</label>
					<p>Game not started.</p>
					<span>
						<button onClick={() => setBoard(blankBoard())}>Start game</button>
					</span>
				</Match>
				<Match when={paused()}>
					<span>
						<button onClick={onReset}>Reset</button>
					</span>
					<p>Game started but paused.</p>
					<span>
						<button onClick={() => setPaused(false)}>Unpause game</button>
					</span>
				</Match>
				<Match when={board() && !paused()}>
					<span>
						<button
							onClick={() => {
								onReset;
							}}>
							Reset
						</button>
					</span>
					<p>Game started and running.</p>
					<span>
						<button onClick={() => setPaused(true)}>Pause game</button>
					</span>
				</Match>
			</Switch>
			<Show when={!!board()} fallback={<p>Loading...</p>}>
				<div>
					<table>
						<Index each={board()} fallback={<p>Loading...</p>}>
							{(row, y) => (
								<tr>
									<Index each={row()} fallback={<p>Loading...</p>}>
										{(value, x) => (
											<td
												style="user-select: none;"
												onClick={[onCellClick, [y, x]]}>
												{value() ? "⬜" : "⬛"}
											</td>
										)}
									</Index>
								</tr>
							)}
						</Index>
					</table>
				</div>
			</Show>
		</div>
	);
}
