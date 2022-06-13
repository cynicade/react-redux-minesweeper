export interface Cell {
  counter: number | null;
  mine: boolean;
  open: boolean;
  flag: boolean;
}

export type Difficulty = "beginner" | "intermediate" | "expert";

export interface Grid {
  sizeX: number;
  sizeY: number;
  mines: number;
  cells: Array<Array<Cell>>;
}
