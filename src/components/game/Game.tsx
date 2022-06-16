import React from "react";
import {
  selectFlagged,
  selectGameState,
  selectMines,
  selectTotalTime,
} from "./gameSlice";
import { useAppSelector } from "../../app/hooks";
import { Typography, Grid as Flex, Icon } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { Grid } from "../grid/Grid";

export const Game: React.FC = (): JSX.Element => {
  const gameState = useAppSelector(selectGameState);
  const totalTime = useAppSelector(selectTotalTime);
  const mines = useAppSelector(selectMines);
  const flagged = useAppSelector(selectFlagged);

  if (gameState === "loss" || gameState === "win")
    return (
      <Flex container flexDirection="column" alignItems="center">
        <Flex item>
          <Typography variant="h1" textAlign="center" color="secondary">
            {gameState === "loss" ? "You lost" : "You won!"}
          </Typography>
        </Flex>
        {gameState === "loss" ? (
          <Flex item>
            <Grid />
          </Flex>
        ) : (
          <Flex item>
            <Typography variant="h5" textAlign="center" color="secondary">
              {totalTime &&
                `${totalTime.minutes}:${String(totalTime.seconds).padStart(
                  2,
                  "0"
                )}.${String(totalTime.millis).padStart(3, "0")}`}
            </Typography>
          </Flex>
        )}
      </Flex>
    );

  return (
    <Flex container flexDirection="column">
      <Flex
        item
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          color="secondary"
          marginX="1em"
        >
          Mines: {mines}
        </Typography>
        <Typography
          variant="h5"
          textAlign="center"
          color="secondary"
          marginX="1em"
        >
          <Icon>
            <FlagIcon />
          </Icon>
          : {flagged}
        </Typography>
      </Flex>
      <Flex item>
        <Grid />
      </Flex>
    </Flex>
  );
};
