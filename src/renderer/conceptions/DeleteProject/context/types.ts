import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren;

export type TSubscriberCallback = () => void;

export type TContext = {
  getProject: () => TProject | undefined;
  setProject: (value: TProject | undefined) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
