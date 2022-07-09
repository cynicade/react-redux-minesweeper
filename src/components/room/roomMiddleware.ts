import { Middleware } from "redux";
import { Socket, io } from "socket.io-client";
import { roomActions } from "./roomSlice";
import RoomEvents from "./roomEvents";
import { IGrid, IMember } from "../../types";
import { gameActions } from "../game/gameSlice";
import { isContext } from "vm";

const roomMiddleware: Middleware = (store) => {
  let socket: Socket;

  return (next) => (action) => {
    const isConnectionEstablished =
      socket &&
      store.getState().room.connectionStatus === "connection established";

    if (
      roomActions.createRoom.match(action) ||
      roomActions.startConnecting.match(action) ||
      roomActions.joinRoom.match(action)
    ) {
      if (process.env.NODE_ENV === "development")
        socket = io(process.env.REACT_APP_SOCKET_URL_LOCAL, {
          path: process.env.REACT_APP_SOCKET_PATH_LOCAL,
        });
      else
        socket = io(process.env.REACT_APP_SOCKET_URL, {
          path: process.env.REACT_APP_SOCKET_PATH,
        });
      socket.on("connect", () => {
        store.dispatch(
          roomActions.connectionEstablished({ socketId: socket.id })
        );
        if (roomActions.createRoom.match(action))
          socket.emit(RoomEvents.CreateRoom, store.getState().app.difficulty);
        if (roomActions.joinRoom.match(action))
          socket.emit(RoomEvents.JoinRoom, store.getState().room.roomId);
      });
      socket.on(RoomEvents.NewRoom, (roomId: string) => {
        store.dispatch(roomActions.setRoomId({ roomId }));
        store.dispatch(roomActions.requestNewGrid());
      });
      socket.on(RoomEvents.NewGrid, (grid: IGrid) => {
        store.dispatch(gameActions.getGrid({ grid }));
      });
      socket.on(RoomEvents.MemberStateChanged, (members: Array<IMember>) => {
        store.dispatch(roomActions.setMembers({ members }));
        store.dispatch(roomActions.startRoundIfReady());
      });
      socket.on(RoomEvents.RoundEnd, () => {
        store.dispatch(roomActions.roundEnd());
      });
    }

    if (roomActions.requestNewGrid.match(action)) {
      if (isConnectionEstablished) {
        socket.emit(RoomEvents.RequestGrid, store.getState().room.roomId);
      }
    }

    if (roomActions.leaveRoom.match(action)) {
      if (isConnectionEstablished) {
        socket.emit(RoomEvents.LeaveRoom, store.getState().room.roomId);
        socket.disconnect();
        store.dispatch(gameActions.reset());
      }
    }

    if (roomActions.toggleReady.match(action)) {
      if (isConnectionEstablished) {
        socket.emit(RoomEvents.PlayerToggleReady, store.getState().room.roomId);
      }
    }

    if (roomActions.playerSolvedGrid.match(action)) {
      store.dispatch(roomActions.roundEnd());
      if (isConnectionEstablished) {
        socket.emit(RoomEvents.PlayerSolvedGrid, store.getState().room.roomId);
      }
    }

    if (roomActions.playerLost.match(action)) {
      if (isConnectionEstablished) {
        socket.emit(RoomEvents.PlayerLost, store.getState().room.roomId);
      }
    }

    next(action);
  };
};

export default roomMiddleware;
