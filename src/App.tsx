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
import { Button, Container, Grid as Flex, ThemeProvider } from "@mui/material";
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
      <Container maxWidth="xl">
        {conn === "waiting" ? (
          <Button
            variant="contained"
            onClick={() =>
              dispatch(gameActions.startConnecting({ difficulty: diff }))
            }
          >
            Connect
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => dispatch(gameActions.terminateConnection())}
          >
            Disconnect
          </Button>
        )}
        <Flex container justifyContent="center" alignItems="center">
          <Flex item>
            <Game />
          </Flex>
        </Flex>
      </Container>
    </ThemeProvider>
  );
};

export default App;
