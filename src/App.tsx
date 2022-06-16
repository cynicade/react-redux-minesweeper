import React from "react";

import theme from "./components/styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { Settings } from "./components/settings/Settings";
import { Route, Routes } from "react-router-dom";
import SinglePlayer from "./components/singleplayer/Singleplayer";
import { Room } from "./components/room/Room";

const App: React.FC = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/singleplayer" element={<SinglePlayer />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
