import type { PropsWithChildren } from "react";

export type TSubscriberCallback = () => void;

export type TContext = {
  getIsOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  getContent: () => TMarkdownContent | undefined;
  setContent: (value: TMarkdownContent | undefined) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TProviderProps = PropsWithChildren;
