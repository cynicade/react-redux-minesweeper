import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#53139c",
    },
    secondary: {
      main: "#c5bcd6",
    },
    background: {
      default: "#101112",
    },
    info: {
      main: "#0165df",
    },
  },
  typography: {
    fontFamily: "Roboto",
  },
});

export default theme;
