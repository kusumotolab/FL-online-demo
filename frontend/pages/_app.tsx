import type {} from "@mui/lab/themeAugmentation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { AppProps } from "next/app";

import { Header } from "@/components/Header";
import "@/styles/globals.css";

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        size: "large",
        variant: "outlined",
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        size: "1em",
      },
      styleOverrides: {
        root: {
          padding: "0.1em",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          height: "1em",
        },
      },
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
