import { createSlice } from "@reduxjs/toolkit";

export interface CellState {
  counter: number | null;
  open: boolean;
  mine: boolean;
  flag: boolean;
}

const initialState: CellState = {
  counter: 1,
  open: false,
  mine: false,
  flag: false,
};

export const cellSlice = createSlice({
  name: "cell",
  initialState,
  reducers: {
    open: (state) => {
      state.open = true;
    },
    flag: (state) => {
      // if the cell isn't open, then flag it
      if (!state.open) state.flag = true;
    },
  },
});

export const cellActions = cellSlice.actions;
export default cellSlice.reducer;
