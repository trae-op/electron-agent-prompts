import { type ReactNode } from "react";

export type TProviderProps = {
  children: ReactNode;
};

export type TProviderProfileProps = {
  children: ReactNode;
};

export type TUserPopoverProps = {
  nav: ReactNode;
  isNewVersionApp?: boolean;
};
