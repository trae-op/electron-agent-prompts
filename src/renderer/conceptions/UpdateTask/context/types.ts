import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren;

export type TSubscriberCallback = () => void;

export type TContext = {
  getTask: () => TTask | undefined;
  setTask: (value: TTask | undefined) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
  getProjects: () => TProject[];
  setProjects: (value: TProject[]) => void;
  getIde: () => string | undefined;
  setIde: (value: string | undefined) => void;
  getIsSkills: () => boolean;
  setIsSkills: (value: boolean) => void;
};
