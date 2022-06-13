import { Middleware } from "redux";
import { Socket, io } from "socket.io-client";
import { gameActions } from "./gameSlice";
import gameEvents from "./gameEvents";
import { Grid } from "../grid/grid";

const gameMiddleware: Middleware = (store) => {
  let socket: Socket;
  return (next) => (action) => {
    const isConnectionEstablished =
      socket &&
      store.getState().game.connectionStatus === "connection established";
    if (gameActions.startConnecting.match(action)) {
      if (process.env.NODE_ENV === "development")
        socket = io(process.env.REACT_APP_SOCKET_URL_LOCAL, {
          path: process.env.REACT_APP_SOCKET_PATH_LOCAL,
        });
      else
        socket = io(process.env.REACT_APP_SOCKET_URL, {
          path: process.env.REACT_APP_SOCKET_PATH,
        });
      socket.on("connect", () => {
        store.dispatch(gameActions.connectionEstablished());
        socket.emit(gameEvents.RequestGrid, store.getState().game.difficulty);
      });
      socket.on(gameEvents.NewGrid, (grid: Grid) => {
        store.dispatch(gameActions.gotGrid({ grid }));
      });
    }

    if (gameActions.getNewGrid.match(action)) {
      if (isConnectionEstablished) {
        socket.emit(gameEvents.RequestGrid, store.getState().game.difficulty);
      }
    }

    if (gameActions.terminateConnection.match(action)) {
      if (isConnectionEstablished) {
        socket.disconnect();
      }
    }

    next(action);
  };
};

export default gameMiddleware;
