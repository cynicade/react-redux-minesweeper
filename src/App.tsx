import React from "react";

import { useAppSelector, useAppDispatch } from "./app/hooks";
import { gameActions } from "./app/gameSlice";
import { Grid } from "./components/grid/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import "./App.css";
import { Difficulty } from "./app/Grid";

function App() {
  const [diff, setDiff] = React.useState<string>("beginner");
  const dispatch = useAppDispatch();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Difficulty</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={diff}
          onChange={(e) => setDiff(e.target.value)}
        >
          <FormControlLabel
            value="beginner"
            control={<Radio />}
            label="Beginner"
          />
          <FormControlLabel
            value="intermediate"
            control={<Radio />}
            label="Intermediate"
          />
          <FormControlLabel value="expert" control={<Radio />} label="Expert" />
        </RadioGroup>
      </FormControl>
      <button
        onClick={() =>
          dispatch(gameActions.startConnecting({ difficulty: diff }))
        }
      >
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
