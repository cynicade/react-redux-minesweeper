import React from "react";

import { useAppSelector, useAppDispatch } from "./app/hooks";
import {
  gameActions,
  selectConnectionStatus,
  selectGameDifficulty,
} from "./components/game/gameSlice";
import theme from "./components/styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { Difficulty } from "./components/grid/grid";
import { Box, Button, Container, ThemeProvider } from "@mui/material";
import { Settings } from "./components/settings/Settings";
import { Game } from "./components/game/Game";

const App: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const diff: Difficulty | null = useAppSelector(selectGameDifficulty);
  const conn: string = useAppSelector(selectConnectionStatus);

  if (diff === null)
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Settings />;
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: "100vh" }}>
        <Button
          variant="contained"
          onClick={() =>
            conn === "waiting"
              ? dispatch(gameActions.startConnecting({ difficulty: diff }))
              : dispatch(gameActions.terminateConnection())
          }
          sx={{
            position: "absolute",
            right: "1em",
            marginY: "1em",
          }}
        >
          {conn === "waiting" ? "Connect" : "Disconnect"}
        </Button>
        <Box
          component="div"
          m="1"
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Game />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
