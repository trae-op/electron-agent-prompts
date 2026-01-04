import type { PropsWithChildren } from "react";

export type TSubscriberCallback = () => void;

export type TContext = {
  getIsOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  getMarkdownValue: () => string;
  setMarkdownValue: (value: string) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TProviderProps = PropsWithChildren;
