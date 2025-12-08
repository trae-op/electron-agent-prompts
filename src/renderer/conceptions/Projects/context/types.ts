import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren<{
  initialProjects?: TProject[];
}>;

export type TSubscriberCallback = () => void;

export type TContext = {
  getProjects: () => TProject[];
  setProjects: (value: TProject[]) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
