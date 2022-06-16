import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import gameReducer from "../components/game/gameSlice";
import roomReducer from "../components/room/roomSlice";
import appReducer from "./appSlice";
// import gameMiddleware from "../components/game/gameMiddleware";
import roomMiddleware from "../components/room/roomMiddleware";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    room: roomReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([roomMiddleware]);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
