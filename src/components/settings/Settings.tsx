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
        marginTop={"40%"}
      >
        <Grid item xs={12}>
          <Typography variant="h4" textAlign="center" color="secondary">
            Select game difficulty
          </Typography>
        </Grid>
        <Grid item margin="1em">
          <Button
            variant="contained"
            onClick={() =>
              dispatch(gameActions.selectDifficulty({ difficulty: "beginner" }))
            }
          >
            Beginner
          </Button>
        </Grid>
        <Grid item margin="1em">
          <Button
            variant="contained"
            onClick={() =>
              dispatch(
                gameActions.selectDifficulty({ difficulty: "intermediate" })
              )
            }
          >
            Intermediate
          </Button>
        </Grid>
        <Grid item margin="1em">
          <Button
            variant="contained"
            onClick={() =>
              dispatch(gameActions.selectDifficulty({ difficulty: "expert" }))
            }
          >
            Expert
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
