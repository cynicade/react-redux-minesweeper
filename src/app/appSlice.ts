import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Difficulty } from "../types";
import { RootState } from "./store";

export interface AppState {
  multiplayer: boolean;
  joinRoom: boolean;
  difficulty: Difficulty | null;
}

const initialState: AppState = {
  multiplayer: false,
  joinRoom: false,
  difficulty: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<{ multiplayer: boolean }>) => {
      state.multiplayer = action.payload.multiplayer;
    },
    setDifficulty: (
      state,
      action: PayloadAction<{ difficulty: Difficulty }>
    ) => {
      state.difficulty = action.payload.difficulty;
    },
    backToMenu: (state) => {
      state.difficulty = null;
      state.multiplayer = false;
    },
  },
});

export const selectMultiplayer = (state: RootState) => state.app.multiplayer;
export const selectDifficulty = (state: RootState) => state.app.difficulty;
export const appActions = appSlice.actions;
export default appSlice.reducer;
