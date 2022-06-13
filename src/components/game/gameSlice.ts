import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Difficulty, Grid } from "../grid/grid";
import { RootState } from "../../app/store";

export interface GameState {
  connectionStatus: "waiting" | "connecting" | "connection established";
  grid: Grid | null;
  gameStatus: "loss" | "win" | "in progress" | null;
  difficulty: Difficulty | null;
  openedCellCount: number | null;
  flaggedCellCount: number | null;
}

const initialState: GameState = {
  connectionStatus: "waiting",
  grid: null,
  gameStatus: null,
  difficulty: null,
  openedCellCount: null,
  flaggedCellCount: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startConnecting: (
      state,
      action: PayloadAction<{
        difficulty: Difficulty;
      }>
    ) => {
      state.connectionStatus = "connecting";
      state.difficulty = action.payload.difficulty;
    },
    connectionEstablished: (state) => {
      state.connectionStatus = "connection established";
    },
    terminateConnection: (state) => {
      state.connectionStatus = "waiting";
    },
    gotGrid: (state, action: PayloadAction<{ grid: Grid }>) => {
      state.grid = action.payload.grid;
      state.gameStatus = "in progress";
      state.openedCellCount = 0;
      state.flaggedCellCount = 0;
    },
    selectDifficulty: (
      state,
      action: PayloadAction<{
        difficulty: Difficulty;
      }>
    ) => {
      state.difficulty = action.payload.difficulty;
    },
    openCell: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.grid && state.grid.cells) {
        const x = action.payload.x;
        const y = action.payload.y;
        const openCellsAround = (y: number, x: number): void => {
          if (!state.grid || !state.grid.cells) return;
          for (let i = x - 1; i < x + 2; ++i) {
            for (let j = y - 1; j < y + 2; ++j) {
              if (
                i >= 0 &&
                j >= 0 &&
                i < state.grid.sizeX &&
                j < state.grid.sizeY
              ) {
                if (!state.grid.cells[j][i].open) {
                  state.grid.cells[j][i].open = true;
                  if (state.openedCellCount !== null)
                    state.openedCellCount += 1;
                  if (
                    state.flaggedCellCount !== null &&
                    state.grid.cells[y][x].flag
                  )
                    state.flaggedCellCount -= 1;
                  if (state.grid.cells[j][i].counter === 0)
                    openCellsAround(j, i);
                }
              }
            }
          }
        };

        state.grid.cells[y][x].open = true;
        if (state.openedCellCount !== null) state.openedCellCount += 1;
        if (state.flaggedCellCount !== null && state.grid.cells[y][x].flag)
          state.flaggedCellCount -= 1;

        if (state.grid.cells[y][x].mine) state.gameStatus = "loss";
        if (state.grid.cells[y][x].counter === 0) {
          openCellsAround(y, x);
        }
        if (state.flaggedCellCount !== null && state.openedCellCount !== null)
          if (
            state.openedCellCount ===
              state.grid.sizeX * state.grid.sizeY - state.flaggedCellCount &&
            state.flaggedCellCount === state.grid.mines
          )
            state.gameStatus = "win";
      }
    },
    flagCell: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.grid && state.grid.cells) {
        state.grid.cells[action.payload.y][action.payload.x].flag =
          !state.grid.cells[action.payload.y][action.payload.x].flag;
        if (state.flaggedCellCount !== null)
          state.grid.cells[action.payload.y][action.payload.x].flag
            ? state.flaggedCellCount++
            : state.flaggedCellCount--;
        if (state.flaggedCellCount !== null && state.openedCellCount !== null)
          if (
            state.openedCellCount ===
              state.grid.sizeX * state.grid.sizeY - state.flaggedCellCount &&
            state.flaggedCellCount === state.grid.mines
          )
            state.gameStatus = "win";
      }
    },
  },
});

const getNewGrid = createAction("game/get_new_grid");

export const selectConnectionStatus = (state: RootState) =>
  state.game.connectionStatus;
export const selectGrid = (state: RootState) => state.game.grid;
export const selectCells = (state: RootState) =>
  state.game.grid ? state.game.grid.cells : null;
export const selectGameState = (state: RootState) => state.game.gameStatus;
export const selectGameDifficulty = (state: RootState) => state.game.difficulty;
export const gameActions = { ...gameSlice.actions, getNewGrid };
export default gameSlice.reducer;
