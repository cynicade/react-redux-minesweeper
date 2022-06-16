import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IGrid, IMember } from "../../types";
import { RootState, store } from "../../app/store";
import { room } from "./roomAPI";

export interface GameState {
  connectionStatus: "waiting" | "connecting" | "connection established";
  memberDataStatus: "waiting" | "loading" | "succeeded" | "failed";
  members: Array<IMember>;
  roundInProgress: boolean;
  roomId: string | null;
  grid: IGrid | null;
}

const initialState: GameState = {
  connectionStatus: "waiting",
  memberDataStatus: "waiting",
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
  extraReducers(builder) {
    builder
      .addCase(getMemberData.pending, (state, _action) => {
        state.memberDataStatus = "loading";
        state.members = [];
      })
      .addCase(getMemberData.fulfilled, (state, action) => {
        state.memberDataStatus = "succeeded";
        state.members = action.payload;
      })
      .addCase(getMemberData.rejected, (state, _action) => {
        state.memberDataStatus = "failed";
        state.members = [];
      });
  },
});

export const getMemberData = createAsyncThunk(
  "room/getMemberData",
  async () => {
    const roomId = store.getState().room.roomId;
    if (roomId) return (await room.getMembers(roomId)) as Array<IMember>;

    // TODO: handle errors
    return [];
  }
);

const requestNewGrid = createAction("room/request_new_grid");
const createRoom = createAction("room/create_room");

export const selectMembers = (state: RootState) => state.room.members;
export const selectMemberDataStatus = (state: RootState) =>
  state.room.memberDataStatus;
export const selectConnection = (state: RootState) =>
  state.room.connectionStatus;
export const selectRoomId = (state: RootState) => state.room.roomId;
export const roomActions = {
  ...roomSlice.actions,
  getMemberData,
  requestNewGrid,
  createRoom,
};
export default roomSlice.reducer;
