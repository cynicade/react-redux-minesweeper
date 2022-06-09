import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import gameReducer from "./gameSlice";
import gameMiddleware from "./gameMiddleware";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    game: gameReducer,
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
