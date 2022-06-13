import React from "react";
import {
  gameActions,
  selectConnectionStatus,
  selectGameState,
} from "./gameSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button, Typography, Grid as Flex } from "@mui/material";
import { Grid } from "../grid/Grid";

export const Game: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const connection = useAppSelector(selectConnectionStatus);
  const gameState = useAppSelector(selectGameState);

  if (connection !== "connection established")
    return (
      <div>
        <Typography variant="h5" textAlign="center" color="secondary">
          {connection}
        </Typography>
      </div>
    );

  if (gameState === "loss" || gameState === "win")
    return (
      <Flex container flexDirection="column" alignItems="center">
        <Flex item>
          <Typography variant="h1" textAlign="center" color="secondary">
            {gameState === "loss" ? "You lost" : "You won!"}
          </Typography>
        </Flex>
        {gameState === "loss" && (
          <Flex item>
            <Grid />
          </Flex>
        )}
        <Flex item marginTop="2em">
          <Button
            variant="contained"
            onClick={() => dispatch(gameActions.getNewGrid())}
          >
            New Grid
          </Button>
        </Flex>
      </Flex>
    );

  return <Grid />;
};
