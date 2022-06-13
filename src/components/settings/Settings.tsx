import { Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { gameActions } from "../game/gameSlice";
import { useAppDispatch } from "../../app/hooks";

export const Settings: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Grid
        container
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        marginY="auto"
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: "translate(-50%, -50%)" }}
      >
        <Grid item xs={12}>
          <Typography variant="h4" textAlign="center" color="secondary">
            Select game difficulty
          </Typography>
        </Grid>
        <Grid item margin="1em">
          <Button
            variant="contained"
            onClick={() => {
              dispatch(
                gameActions.selectDifficulty({ difficulty: "beginner" })
              );
              dispatch(gameActions.getNewGrid());
            }}
          >
            Beginner
          </Button>
        </Grid>
        <Grid item margin="1em">
          <Button
            variant="contained"
            onClick={() => {
              dispatch(
                gameActions.selectDifficulty({ difficulty: "intermediate" })
              );
              dispatch(gameActions.getNewGrid());
            }}
          >
            Intermediate
          </Button>
        </Grid>
        <Grid item margin="1em">
          <Button
            variant="contained"
            onClick={() => {
              dispatch(gameActions.selectDifficulty({ difficulty: "expert" }));
              dispatch(gameActions.getNewGrid());
            }}
          >
            Expert
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
