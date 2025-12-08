import { memo, useCallback } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import type { MouseEvent } from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

import { usePaletteModeSelector, useTogglePaletteMode } from "../hooks";
import type { TPropsToggle } from "./types";

export const Toggle = memo(({ onClick, ...other }: TPropsToggle) => {
  const mode = usePaletteModeSelector();
  const toggleMode = useTogglePaletteMode();
  const isDark = mode === "dark";

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      toggleMode();
    },
    [onClick, toggleMode]
  );

  return (
    <Tooltip
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      enterDelay={200}
    >
      <IconButton
        {...other}
        aria-label={isDark ? "Enable light mode" : "Enable dark mode"}
        color="inherit"
        data-testid="light-dark-mode:toggle"
        onClick={handleClick}
        size="small"
      >
        {isDark ? (
          <LightModeOutlinedIcon fontSize="small" />
        ) : (
          <DarkModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
});

Toggle.displayName = "LightDarkModeToggle";
