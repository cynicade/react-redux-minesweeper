import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  roomActions,
  selectMemberDataStatus,
  selectMembers,
  selectRoomId,
} from "./roomSlice";
import { IMember } from "../../types";
import { useNavigate } from "react-router-dom";

export const Room: React.FC = (): JSX.Element => {
  const [alertOpen, setAlertOpen] = React.useState(true);
  const members = useAppSelector(selectMembers);
  const memberDataStatus = useAppSelector(selectMemberDataStatus);
  const roomId = useAppSelector(selectRoomId);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (memberDataStatus === "waiting" && roomId)
      dispatch(roomActions.getMemberData());
  }, [dispatch, memberDataStatus, roomId]);

  const handleAlertClose = (): void => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh" }}>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(roomActions.leaveRoom());
          navigate("/", { replace: true });
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
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%", width: "100%" }}
      >
        <Grid item sx={{ minWidth: "250px" }}>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              borderRadius: "5px",
            }}
          >
            {members.map((member: IMember) => (
              <ListItem
                key={member.name}
                divider
                secondaryAction={
                  <IconButton>
                    <CheckIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={member.name} secondary={member.score} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Dialog open={alertOpen} onClose={handleAlertClose}>
        <DialogTitle id="alert-dialog-title">
          Multiplayer mode not yet fully implemented
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
