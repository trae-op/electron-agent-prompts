import { useSyncExternalStore } from "react";
import type { PaletteMode } from "@mui/material";

import { useLightDarkModeContext } from "../context";

export const usePaletteModeSelector = (): PaletteMode => {
  const { subscribe, getMode } = useLightDarkModeContext();
  return useSyncExternalStore(subscribe, getMode, getMode);
};
