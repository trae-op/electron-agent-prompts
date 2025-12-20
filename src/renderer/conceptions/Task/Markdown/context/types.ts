import { type PropsWithChildren } from "react";

export type TSubscriberCallback = () => void;

export type TContext = {
  getContents: () => TMarkdownContent[];
  setContents: (value: TMarkdownContent[]) => void;
  addContent: (value: TMarkdownContent) => void;
  updateContent: (value: TMarkdownContent) => void;
  deleteContent: (id: string) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TProviderProps = PropsWithChildren<{
  items?: TMarkdownContent[];
}>;
