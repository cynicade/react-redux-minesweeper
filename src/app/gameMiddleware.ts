import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { gameActions } from "./gameSlice";
import gameEvents from "./gameEvents";
import { Grid } from "./Grid";

const gameMiddleware: Middleware = (store) => {
  let socket: Socket;
  return (next) => (action) => {
    const isConnectionEstablished =
      socket &&
      store.getState().game.connectionStatus === "connection established";
    if (gameActions.startConnecting.match(action)) {
      socket = io(process.env.REACT_APP_SOCKET_URL);
      socket.on("connect", () => {
        store.dispatch(gameActions.connectionEstablished());
        socket.emit(gameEvents.PlayerJoined, "beginner");
      });
      socket.on(gameEvents.NewGrid, (grid: Grid) => {
        store.dispatch(gameActions.gotGrid({ grid }));
      });
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
