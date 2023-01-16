export type Colour = "grey" | "yellow" | "green";

export type FilterData = Record<
	number,
	Record<number, { colour: Colour; letter: string }>
>;
