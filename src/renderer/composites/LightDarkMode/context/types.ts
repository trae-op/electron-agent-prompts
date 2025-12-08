import type { PaletteMode } from "@mui/material";
import type { ReactNode } from "react";

export type TProviderProps = {
  children: ReactNode;
};

export type TSubscriberCallback = () => void;

export type TContext = {
  getMode: () => PaletteMode;
  setMode: (mode: PaletteMode) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
