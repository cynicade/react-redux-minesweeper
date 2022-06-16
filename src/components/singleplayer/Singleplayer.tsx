import React from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Game } from "../game/Game";
import { Button, Container, Grid } from "@mui/material";
import { appActions } from "../../app/appSlice";
import {
  gameActions,
  selectGameState,
  selectGridStatus,
} from "../game/gameSlice";

export const SinglePlayer: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const gameStatus = useAppSelector(selectGameState);
  const gridStatus = useAppSelector(selectGridStatus);

  React.useEffect(() => {
    if (gridStatus === "waiting") {
      dispatch(gameActions.getNewGrid());
    }
  }, [gridStatus, dispatch]);

  const handleClickNewGame = () => {
    dispatch(gameActions.reset());
    dispatch(gameActions.getNewGrid());
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh" }}>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(appActions.backToMenu());
          dispatch(gameActions.reset());
        }}
        sx={{
          position: "absolute",
          right: "1em",
          marginY: "1em",
        }}
      >
        Back
      </Button>
      <Grid
        container
        position="absolute"
        top="50%"
        left="50%"
        flexDirection="column"
        alignItems="center"
        sx={{ transform: "translate(-50%, -50%)" }}
      >
        <Grid item>
          <Game />
        </Grid>
        {(gameStatus === "loss" || gameStatus === "win") && (
          <Grid item>
            <Button
              onClick={handleClickNewGame}
              variant="contained"
              size="medium"
              sx={{ maxWidth: "10em", m: "1em" }}
            >
              New Game
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SinglePlayer;
