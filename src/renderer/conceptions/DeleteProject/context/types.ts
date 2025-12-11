import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren;

export type TSubscriberCallback = () => void;

export type TContext = {
  getIsOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  getProject: () => TProject | undefined;
  setProject: (value: TProject | undefined) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
