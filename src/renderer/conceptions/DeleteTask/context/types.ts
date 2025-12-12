import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren;

export type TSubscriberCallback = () => void;

export type TContext = {
  getIsOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  getTask: () => TTask | undefined;
  setTask: (value: TTask | undefined) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
