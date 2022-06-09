import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Grid } from "./Grid";
import { RootState } from "./store";

export interface GameState {
  connectionStatus: "waiting" | "connecting" | "connection established";
  grid: Grid | null;
  gameStatus: "loss" | "win" | "in progress" | null;
}

const initialState: GameState = {
  connectionStatus: "waiting",
  grid: null,
  gameStatus: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.connectionStatus = "connecting";
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
                  if (state.grid.cells[j][i].counter === 0)
                    openCellsAround(j, i);
                }
              }
            }
          }
        };
        state.grid.cells[y][x].open = true;

        if (state.grid.cells[y][x].mine) state.gameStatus = "loss";
        if (state.grid.cells[y][x].counter === 0) {
          openCellsAround(y, x);
        }
      }
    },
    flagCell: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.grid && state.grid.cells)
        state.grid.cells[action.payload.y][action.payload.x].flag =
          !state.grid.cells[action.payload.y][action.payload.x].flag;
    },
  },
});

export const selectConnectionStatus = (state: RootState) =>
  state.game.connectionStatus;
export const selectGrid = (state: RootState) => state.game.grid;
export const selectCells = (state: RootState) =>
  state.game.grid ? state.game.grid.cells : null;
export const selectGameState = (state: RootState) => state.game.gameStatus;
export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
