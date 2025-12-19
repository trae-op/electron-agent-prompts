import { type PropsWithChildren } from "react";

export type TTypesContent = "edit" | "code" | "list";

export type TContent = {
  type: TTypesContent;
  content: string;
  id: string;
  position: number;
};

export type TSubscriberCallback = () => void;

export type TContext = {
  getContents: () => TContent[];
  setContents: (value: TContent[]) => void;
  addContent: (value: TContent) => void;
  deleteContent: (id: string) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TProviderProps = PropsWithChildren<{
  items?: TContent[];
}>;
