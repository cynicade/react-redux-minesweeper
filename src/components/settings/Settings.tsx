import { Button, Container, Grid } from "@mui/material";
import React from "react";
import { gameActions } from "../../app/gameSlice";
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
      >
        <Grid item>
          <Button
            variant="outlined"
            onClick={() =>
              dispatch(gameActions.selectDifficulty({ difficulty: "beginner" }))
            }
          >
            Beginner
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() =>
              dispatch(
                gameActions.selectDifficulty({ difficulty: "intermediate" })
              )
            }
          >
            Intermediate
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
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
