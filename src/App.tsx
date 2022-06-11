import React from "react";

import { useAppSelector, useAppDispatch } from "./app/hooks";
import { gameActions, selectGameDifficulty } from "./app/gameSlice";
import { Grid } from "./components/grid/Grid";
import "./App.css";
import { Difficulty } from "./app/Grid";
import { Button, Container, Grid as Flex } from "@mui/material";
import { Settings } from "./components/settings/Settings";

const App: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const diff: Difficulty | null = useAppSelector(selectGameDifficulty);

  if (diff === null) return <Settings />;

  return (
    <Container maxWidth="lg">
      <Flex container flexDirection="row">
        <Flex item>
          <Button
            variant="contained"
            onClick={() =>
              dispatch(gameActions.startConnecting({ difficulty: diff }))
            }
          >
            Connect
          </Button>
        </Flex>
        <Flex item>
          <Button
            variant="contained"
            onClick={() => dispatch(gameActions.terminateConnection())}
          >
            Disconnect
          </Button>
        </Flex>
      </Flex>
      <Flex container justifyContent="center" alignItems="center">
        <Flex item>
          <Grid />
        </Flex>
      </Flex>
    </Container>
  );
};

export default App;
