import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { gameActions } from "../game/gameSlice";
import { useAppDispatch } from "../../app/hooks";

export const Settings: React.FC = (): JSX.Element => {
  const [roomMode, setRoomMode] = React.useState<boolean>(false);
  const [roomIdValue, setRoomIdValue] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const dirtyInput = e.target.value;
    dirtyInput === "true" ? setRoomMode(true) : setRoomMode(false);
  };

  const handleRoomIdInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRoomIdValue(e.target.value);
  };

  const handleClickOpen = (): void => {
    setModalOpen(true);
  };

  const handleClose = (): void => {
    setModalOpen(false);
  };

  const handleAlertClose = (): void => {
    setAlertOpen(false);
    setModalOpen(true);
  };

  const handleJoin = (): void => {
    setModalOpen(false);
    fetch(
      process.env.REACT_APP_API_URL_LOCAL + "/checkRoom/" + roomIdValue
    ).then((res) => {
      if (res.status === 200) {
        dispatch(gameActions.setRoom({ roomId: roomIdValue }));
        dispatch(gameActions.joinRoom());
      } else setAlertOpen(true);
    });
  };

  return (
    <Container maxWidth="lg" sx={{ height: "100%" }}>
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
              roomMode && dispatch(gameActions.createRoom());
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
              roomMode && dispatch(gameActions.createRoom());
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
              roomMode && dispatch(gameActions.createRoom());
              dispatch(gameActions.getNewGrid());
            }}
          >
            Expert
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          textAlign="center"
          color="secondary.main"
          marginTop="2em"
        >
          <FormControl>
            <FormLabel>
              <Typography variant="h5" color="secondary.main">
                Select mode
              </Typography>
            </FormLabel>
            <RadioGroup
              value={roomMode}
              onChange={handleChange}
              name="radio-buttons-group"
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Single Player"
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Multi Player"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item m="1em" xs={12}>
          <Button
            variant="outlined"
            sx={{
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            onClick={handleClickOpen}
          >
            Join Room
          </Button>
        </Grid>
      </Grid>
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle>Join a room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="roomId"
            label="Room Code"
            type="text"
            fullWidth
            variant="standard"
            value={roomIdValue}
            onChange={handleRoomIdInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleJoin}>Join</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <DialogTitle id="alert-dialog-title">
          {`Room ${roomIdValue} not found`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleAlertClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
