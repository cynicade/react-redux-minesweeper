import React from "react";

import { useAppSelector } from "./app/hooks";
import { selectDifficulty, selectMultiplayer } from "./app/appSlice";
import theme from "./components/styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { Settings } from "./components/settings/Settings";
import { Room } from "./components/room/Room";
import SinglePlayer from "./components/singleplayer/Singleplayer";
import { Difficulty } from "./types";

const App: React.FC = (): JSX.Element => {
  const multiplayer: boolean | null = useAppSelector(selectMultiplayer);
  const difficulty: Difficulty | null = useAppSelector(selectDifficulty);

  if (!multiplayer && !difficulty)
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Settings />;
      </ThemeProvider>
    );

  if (multiplayer) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Room />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SinglePlayer />
    </ThemeProvider>
  );
};

export default App;
