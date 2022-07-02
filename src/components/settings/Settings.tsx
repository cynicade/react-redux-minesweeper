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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { roomActions } from "../room/roomSlice";
import { appActions, selectMultiplayer } from "../../app/appSlice";
import { useNavigate } from "react-router-dom";

export const Settings: React.FC = (): JSX.Element => {
  const [roomIdValue, setRoomIdValue] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const multiplayer = useAppSelector(selectMultiplayer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const dirtyInput = e.target.value;
    dirtyInput === "true"
      ? dispatch(appActions.setMode({ multiplayer: true }))
      : dispatch(appActions.setMode({ multiplayer: false }));
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

  const handleJoin = async (): Promise<void> => {
    setModalOpen(false);
    const res = await fetch(
      process.env.REACT_APP_API_URL_LOCAL + "/checkRoom/" + roomIdValue
    );
    if (res.status === 200) {
      dispatch(appActions.setMode({ multiplayer: true }));
      dispatch(roomActions.setRoomId({ roomId: roomIdValue }));
      dispatch(roomActions.joinRoom());
      navigate("./room", { replace: true });
    } else setAlertOpen(true);
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
              dispatch(appActions.setDifficulty({ difficulty: "beginner" }));
              if (multiplayer) {
                dispatch(roomActions.createRoom());
                navigate("./room", { replace: true });
              } else navigate("./singleplayer", { replace: true });
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
                appActions.setDifficulty({ difficulty: "intermediate" })
              );
              if (multiplayer) {
                dispatch(roomActions.createRoom());
                navigate("./room", { replace: true });
              } else navigate("./singleplayer", { replace: true });
            }}
          >
            Intermediate
          </Button>
        </Grid>
        <Grid item margin="1em">
          <Button
            variant="contained"
            onClick={() => {
              dispatch(appActions.setDifficulty({ difficulty: "expert" }));
              if (multiplayer) {
                dispatch(roomActions.createRoom());
                navigate("./room", { replace: true });
              } else navigate("./singleplayer", { replace: true });
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
              value={multiplayer}
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
            color="secondary"
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
