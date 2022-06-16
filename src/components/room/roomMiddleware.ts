import { Middleware } from "redux";
import { Socket, io } from "socket.io-client";
import { roomActions } from "./roomSlice";
import RoomEvents from "./roomEvents";
import { IGrid } from "../../types";

const roomMiddleware: Middleware = (store) => {
  let socket: Socket;

  return (next) => (action) => {
    const isConnectionEstablished =
      socket &&
      store.getState().room.connectionStatus === "connection established";
    if (roomActions.startConnecting.match(action)) {
      if (process.env.NODE_ENV === "development")
        socket = io(process.env.REACT_APP_SOCKET_URL_LOCAL, {
          path: process.env.REACT_APP_SOCKET_PATH_LOCAL,
        });
      else
        socket = io(process.env.REACT_APP_SOCKET_URL, {
          path: process.env.REACT_APP_SOCKET_PATH,
        });
      socket.on("connect", () => {
        store.dispatch(roomActions.connectionEstablished());
      });
      socket.on(RoomEvents.NewGrid, (grid: IGrid) => {
        store.dispatch(roomActions.getGrid({ grid }));
      });
    }

    if (roomActions.requestNewGrid.match(action)) {
      if (isConnectionEstablished) {
        socket.emit(RoomEvents.RequestGrid, store.getState().app.difficulty);
      }
    }

    if (roomActions.terminateConnection.match(action)) {
      if (isConnectionEstablished) {
        socket.disconnect();
      }
    }

    if (roomActions.leaveRoom.match(action)) {
      if (isConnectionEstablished) {
        socket.emit(RoomEvents.LeaveRoom, store.getState().room.roomId);
      }
    }

    next(action);
  };
};

export default roomMiddleware;
