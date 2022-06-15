import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import gameReducer from "../components/game/gameSlice";
import roomReducer from "../components/room/roomSlice";
import gameMiddleware from "../components/game/gameMiddleware";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    room: roomReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([gameMiddleware]);
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
