import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGrid, IMember } from "../../types";
import { RootState } from "../../app/store";
import { getMembers } from "./roomAPI";

export interface GameState {
  members: Array<IMember>;
  roundInProgress: boolean;
  roomId: string | null;
  grid: IGrid | null;
}

const initialState: GameState = {
  members: [],
  roundInProgress: false,
  roomId: null,
  grid: null,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    getRoomId: (state, action: PayloadAction<{ roomId: string }>) => {
      state.roomId = action.payload.roomId;
    },
    getGrid: (state, action: PayloadAction<{ grid: IGrid }>) => {
      state.grid = action.payload.grid;
    },
    getMemberData: (state) => {
      state.roomId &&
        getMembers(state.roomId).then((members) => (state.members = members));
    },
    startRoundIfReady: (state) => {
      const membersReady = state.members.filter(
        (member: IMember) => member.ready
      );
      if (
        membersReady.length == state.members.length &&
        state.members.length > 0
      )
        state.roundInProgress = true;
    },
  },
});

export const selectMembers = (state: RootState) => state.room.members;
export const roomActions = {
  ...roomSlice.actions,
};
export default roomSlice.reducer;
