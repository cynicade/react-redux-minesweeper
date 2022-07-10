import {
  Box,
  Button,
  Container,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  roomActions,
  selectMembers,
  selectRoomId,
  selectPlayerSocketId,
  selectRoundInProgress,
} from "./roomSlice";
import { IMember } from "../../types";
import { useNavigate } from "react-router-dom";
import { Game } from "../game/Game";
import MultiPlayer from "../multiplayer/Multiplayer";

export const Room: React.FC = (): JSX.Element => {
  const members = useAppSelector(selectMembers);
  const roomId = useAppSelector(selectRoomId);
  const playerSocketId = useAppSelector(selectPlayerSocketId);
  const roundInProgress = useAppSelector(selectRoundInProgress);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleReady = () => {
    dispatch(roomActions.toggleReady());
  };

  if (!roundInProgress)
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
        <Typography
          variant="h4"
          color="secondary"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Room {roomId}
        </Typography>
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
              {members.map((member: IMember) => {
                let primaryText;

                if (member.socketId !== playerSocketId) {
                  primaryText = (
                    <Grid container alignItems="center">
                      <Grid item mr="1em">
                        <Typography p={0} m={0}>
                          {member.name}
                        </Typography>
                      </Grid>
                      {member.ready ? (
                        <Grid item>
                          <Typography color="primary" fontStyle="italic">
                            ready
                          </Typography>
                        </Grid>
                      ) : (
                        <Grid item>
                          <Typography color="primary" fontStyle="italic">
                            not ready
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  );
                } else
                  primaryText = (
                    <Typography fontWeight="bold" color="primary">
                      {member.name}
                    </Typography>
                  );

                return (
                  <ListItem
                    key={member.socketId}
                    divider
                    secondaryAction={
                      member.socketId === playerSocketId && (
                        <IconButton onClick={toggleReady}>
                          {member.ready ? <ClearIcon /> : <CheckIcon />}
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary={primaryText}
                      secondary={member.score}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </Container>
    );

  // if the round is in progress, render the game
  return <MultiPlayer />;
};
