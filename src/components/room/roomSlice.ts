import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGrid, IMember } from "../../types";
import { RootState } from "../../app/store";
import { getMembers } from "./roomAPI";

export interface GameState {
  connectionStatus: "waiting" | "connecting" | "connection established";
  members: Array<IMember>;
  roundInProgress: boolean;
  roomId: string | null;
  grid: IGrid | null;
}

const initialState: GameState = {
  connectionStatus: "waiting",
  members: [],
  roundInProgress: false,
  roomId: null,
  grid: null,
};

export const roomSlice = createSlice({
  name: "room",
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
    setRoomId: (state, action: PayloadAction<{ roomId: string | null }>) => {
      action.payload.roomId && (state.roomId = action.payload.roomId);
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
        membersReady.length === state.members.length &&
        state.members.length > 0
      )
        state.roundInProgress = true;
    },
    leaveRoom: (state) => {
      state.roomId = null;
    },
  },
});

const requestNewGrid = createAction("room/request_new_grid");
const createRoom = createAction("room/create_room");

export const selectMembers = (state: RootState) => state.room.members;
export const selectConnection = (state: RootState) =>
  state.room.connectionStatus;
export const roomActions = {
  ...roomSlice.actions,
  requestNewGrid,
  createRoom,
};
export default roomSlice.reducer;
