import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGrid, IMember } from "../../types";
import { RootState } from "../../app/store";

export interface GameState {
  connectionStatus: "waiting" | "connecting" | "connection established";
  socketId: string | null;
  members: Array<IMember>;
  roundInProgress: boolean;
  roomId: string | null;
  grid: IGrid | null;
}

const initialState: GameState = {
  connectionStatus: "waiting",
  socketId: null,
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
    connectionEstablished: (
      state,
      action: PayloadAction<{ socketId: string }>
    ) => {
      state.connectionStatus = "connection established";
      state.socketId = action.payload.socketId;
    },
    setRoomId: (state, action: PayloadAction<{ roomId: string | null }>) => {
      action.payload.roomId && (state.roomId = action.payload.roomId);
    },
    setMembers: (state, action: PayloadAction<{ members: Array<IMember> }>) => {
      state.members = action.payload.members;
    },
    getGrid: (state, action: PayloadAction<{ grid: IGrid }>) => {
      state.grid = action.payload.grid;
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
      // reset back to the initial state
      state.connectionStatus = "waiting";
      state.socketId = null;
      state.members = [];
      state.roundInProgress = false;
      state.roomId = null;
      state.grid = null;
    },
    roundEnd: (state) => {
      state.roundInProgress = false;
    },
  },
});

const requestNewGrid = createAction("room/request_new_grid");
const createRoom = createAction("room/create_room");
const joinRoom = createAction("room/join_room");
const toggleReady = createAction("room/toggle_ready");
const playerSolvedGrid = createAction("room/player_solved_grid");
const playerLost = createAction("room/player_lost");

export const selectMembers = (state: RootState) => state.room.members;
export const selectConnection = (state: RootState) =>
  state.room.connectionStatus;
export const selectRoomId = (state: RootState) => state.room.roomId;
export const selectPlayerSocketId = (state: RootState) => state.room.socketId;
export const selectRoundInProgress = (state: RootState) =>
  state.room.roundInProgress;
export const selectMultiplayerGrid = (state: RootState) => state.room.grid;
export const roomActions = {
  ...roomSlice.actions,
  requestNewGrid,
  createRoom,
  joinRoom,
  toggleReady,
  playerSolvedGrid,
  playerLost,
};
export default roomSlice.reducer;
