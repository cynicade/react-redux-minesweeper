import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGrid, ITime } from "../../types";
import { RootState, store } from "../../app/store";
import { game } from "./gameAPI";

export interface GameState {
  grid: IGrid | null;
  gridStatus: "waiting" | "loading" | "succeeded" | "failed";
  gameStatus: "loss" | "win" | "idle" | "in progress" | null;
  openedCellCount: number;
  flaggedCellCount: number;
  startTime: number | null;
  totalTime: ITime | null;
}

const initialState: GameState = {
  grid: null,
  gridStatus: "waiting",
  gameStatus: null,
  openedCellCount: 0,
  flaggedCellCount: 0,
  startTime: null,
  totalTime: null,
};

const stopTimer = (startTime: number): ITime => {
  const totalMs = Date.now() - startTime; // total time in ms
  const getTotalTime = (ms: number): ITime => {
    const time: ITime = {
      minutes: Math.floor(totalMs / 60000),
      seconds: Math.floor((ms / 1000) % 60),
      millis: ms % 1000,
    };
    return time;
  };

  return getTotalTime(totalMs);
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    getGrid: (state, action: PayloadAction<{ grid: IGrid }>) => {
      state.grid = action.payload.grid;
      state.gameStatus = "idle";
    },
    openCell: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.gameStatus === "idle") {
        state.startTime = Date.now();
        state.gameStatus = "in progress";
      }
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

        const showAllMines = (): void => {
          state.grid &&
            state.grid.cells.map((row) =>
              row.forEach((cell) => {
                if (cell.mine && !cell.flag) cell.open = true;
              })
            );
        };

        state.grid.cells[y][x].open = true;
        if (state.openedCellCount !== null) state.openedCellCount += 1;
        if (state.flaggedCellCount !== null && state.grid.cells[y][x].flag)
          state.flaggedCellCount -= 1;

        if (state.grid.cells[y][x].mine) {
          state.gameStatus = "loss";
          showAllMines();
        }
        if (state.grid.cells[y][x].counter === 0) {
          openCellsAround(y, x);
        }
        if (state.flaggedCellCount !== null && state.openedCellCount !== null)
          if (
            state.openedCellCount ===
              state.grid.sizeX * state.grid.sizeY - state.flaggedCellCount &&
            state.flaggedCellCount === state.grid.mines
          ) {
            state.startTime && (state.totalTime = stopTimer(state.startTime));
            state.gameStatus = "win";
          }
      }
    },
    flagCell: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.grid && state.grid.cells) {
        // flip flag on cell
        state.grid.cells[action.payload.y][action.payload.x].flag =
          !state.grid.cells[action.payload.y][action.payload.x].flag;
        // adjust flagged cell count appropriately
        state.grid.cells[action.payload.y][action.payload.x].flag
          ? state.flaggedCellCount++
          : state.flaggedCellCount--;
        // check win condition
        if (
          state.openedCellCount ===
            state.grid.sizeX * state.grid.sizeY - state.flaggedCellCount &&
          state.flaggedCellCount === state.grid.mines
        ) {
          state.startTime && (state.totalTime = stopTimer(state.startTime));
          state.gameStatus = "win";
        }
      }
    },
    reset: (state) => {
      state.grid = null;
      state.gridStatus = "waiting";
      state.gameStatus = null;
      state.openedCellCount = 0;
      state.flaggedCellCount = 0;
      state.startTime = null;
      state.totalTime = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getNewGrid.pending, (state, _action) => {
        state.gridStatus = "loading";
        state.grid = null;
        state.gameStatus = "idle";
      })
      .addCase(getNewGrid.fulfilled, (state, action) => {
        state.gridStatus = "succeeded";
        state.grid = action.payload;
        state.gameStatus = "idle";
      })
      .addCase(getNewGrid.rejected, (state, _action) => {
        state.gridStatus = "failed";
        state.grid = null;
        state.gameStatus = "idle";
      });
  },
});

export const getNewGrid = createAsyncThunk("game/getNewGrid", async () => {
  const diff = store.getState().app.difficulty;
  if (diff) return (await game.getGrid(diff)) as IGrid;

  // TODO: handle errors
  return null;
});

export const selectGrid = (state: RootState) => state.game.grid;
export const selectGridStatus = (state: RootState) => state.game.gridStatus;
export const selectCells = (state: RootState) => state.game.grid?.cells;
export const selectGameState = (state: RootState) => state.game.gameStatus;
export const selectTotalTime = (state: RootState) => state.game.totalTime;
export const selectMines = (state: RootState) => state.game.grid?.mines;
export const selectFlagged = (state: RootState) => state.game.flaggedCellCount;
export const gameActions = {
  ...gameSlice.actions,
  getNewGrid,
};
export default gameSlice.reducer;
