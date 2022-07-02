import React from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Game } from "../game/Game";
import { Button, Container, Grid, Typography } from "@mui/material";
import { selectGameState } from "../game/gameSlice";
import { useNavigate } from "react-router-dom";
import { roomActions } from "../room/roomSlice";

export const MultiPlayer: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const gameStatus = useAppSelector(selectGameState);

  React.useEffect(() => {
    if (gameStatus === "win") dispatch(roomActions.playerSolvedGrid());
    else if (gameStatus === "loss") dispatch(roomActions.playerLost());
  }, [gameStatus]);

  return (
    <Container maxWidth="xl" sx={{ height: "100vh" }}>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(roomActions.leaveRoom());
          navigate("/minesweeper", { replace: true });
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
            <Typography variant="h4" textAlign="center" color="secondary">
              Please wait for the other players to finish...
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default MultiPlayer;
