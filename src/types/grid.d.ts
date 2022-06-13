import Cell from "./cell";

export default interface Grid {
  sizeX: number;
  sizeY: number;
  mines: number;
  cells: Array<Array<Cell>>;
}
