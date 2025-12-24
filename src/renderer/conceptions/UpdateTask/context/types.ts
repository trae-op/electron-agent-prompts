import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren;

export type TSubscriberCallback = () => void;

export type TContext = {
  getTask: () => TTaskWithFoldersContent | undefined;
  setTask: (value: TTaskWithFoldersContent | undefined) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
