import React from "react";

import { useAppSelector, useAppDispatch } from "./app/hooks";
import { gameActions } from "./app/gameSlice";
import { Grid } from "./components/grid/Grid";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={() => dispatch(gameActions.startConnecting())}>
        Connect
      </button>
      <button onClick={() => dispatch(gameActions.terminateConnection())}>
        Disconnect
      </button>
      <Grid />
    </div>
  );
}

export default App;
