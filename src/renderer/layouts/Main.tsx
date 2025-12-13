import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import type { PaletteMode } from "@mui/material";
import { usePaletteModeSelector } from "@composites/LightDarkMode";
import { useClosePreloadWindow } from "@hooks/closePreloadWindow";

const buildTheme = (mode: PaletteMode) =>
  createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            overflowY: "auto",
            overflowX: "hidden",
            "& #root": {
              width: "100%",
            },
          },
        },
      },
    },
    palette: {
      mode,
    },
  });

export const MainLayout = () => {
  useClosePreloadWindow();
  const mode = usePaletteModeSelector();
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Outlet />
      </Box>
    </ThemeProvider>
  );
};
