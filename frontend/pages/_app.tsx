import "../styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { AppProps } from "next/app";
import type {} from "@mui/lab/themeAugmentation";

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
        }
      }
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
