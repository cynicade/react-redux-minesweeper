import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGrid, ITime, Difficulty } from "../../types";
import { RootState } from "../../app/store";

export interface GameState {
  connectionStatus: "waiting" | "connecting" | "connection established";
  grid: IGrid | null;
  gameStatus: "loss" | "win" | "idle" | "in progress" | null;
  difficulty: Difficulty | null;
  openedCellCount: number | null;
  flaggedCellCount: number | null;
  startTime: number | null;
  totalTime: ITime | null;
  room: string | null;
  multiplayer: boolean;
}

const initialState: GameState = {
  connectionStatus: "waiting",
  grid: null,
  gameStatus: null,
  difficulty: null,
  openedCellCount: null,
  flaggedCellCount: null,
  startTime: null,
  totalTime: null,
  room: null,
  multiplayer: false,
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
    startConnecting: (state) => {
      state.connectionStatus = "connecting";
    },
    connectionEstablished: (state) => {
      state.connectionStatus = "connection established";
    },
    terminateConnection: (state) => {
      state.connectionStatus = "waiting";
    },
    gotGrid: (state, action: PayloadAction<{ grid: IGrid }>) => {
      state.grid = action.payload.grid;
      state.gameStatus = "idle";
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
          ) {
            state.startTime && (state.totalTime = stopTimer(state.startTime));
            state.gameStatus = "win";
          }
      }
    },
    resetDifficulty: (state) => {
      state.difficulty = null;
      state.grid = null;
    },
    setRoom: (state, action: PayloadAction<{ roomId: string }>) => {
      state.room = action.payload.roomId;
      state.multiplayer = true;
    },
    leaveRoom: (state) => {
      state.room = null;
      state.multiplayer = false;
    },
  },
});

const getNewGrid = createAction("game/get_new_grid");
const createRoom = createAction("game/create_room");
const joinRoom = createAction("game/join_room");

export const selectConnectionStatus = (state: RootState) =>
  state.game.connectionStatus;
export const selectGrid = (state: RootState) => state.game.grid;
export const selectCells = (state: RootState) => state.game.grid?.cells;
export const selectGameState = (state: RootState) => state.game.gameStatus;
export const selectGameDifficulty = (state: RootState) => state.game.difficulty;
export const selectTotalTime = (state: RootState) => state.game.totalTime;
export const selectMines = (state: RootState) => state.game.grid?.mines;
export const selectFlagged = (state: RootState) => state.game.flaggedCellCount;
export const selectRoom = (state: RootState) => state.game.room;
export const selectMultiplayer = (state: RootState) => state.game.multiplayer;
export const gameActions = {
  ...gameSlice.actions,
  getNewGrid,
  createRoom,
  joinRoom,
};
export default gameSlice.reducer;
