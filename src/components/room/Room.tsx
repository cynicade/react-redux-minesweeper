import { Icon, IconButton, List, ListItem, ListItemText } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectMembers } from "./roomSlice";
import { IMember } from "../../types";

export const Room: React.FC = (): JSX.Element => {
  const members = useAppSelector(selectMembers);

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {members.map((member: IMember) => (
        <ListItem
          key={member.name}
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
  );
};
