import type { PaletteMode } from "@mui/material";

import { STORAGE_KEY_MODE } from "../constants";

const FALLBACK_MODE: PaletteMode = "dark";
const isPaletteMode = (value: unknown): value is PaletteMode => {
  return value === "light" || value === "dark";
};

export const getInitialMode = (): PaletteMode => {
  if (typeof window === "undefined") {
    return FALLBACK_MODE;
  }

  const storedMode = window.localStorage.getItem(STORAGE_KEY_MODE);
  if (isPaletteMode(storedMode)) {
    return storedMode;
  }

  const prefersDark = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;

  return prefersDark ? "dark" : "light";
};
