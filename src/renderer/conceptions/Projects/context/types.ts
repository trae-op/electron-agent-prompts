import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren<{
  initialProjects?: TProject[];
  initialIsLoading?: boolean;
}>;

export type TSubscriberCallback = () => void;

export type TContext = {
  getProjects: () => TProject[];
  getProjectsLoading: () => boolean;
  setProjectsLoading: (value: boolean) => void;
  setProjects: (value: TProject[]) => void;
  addNewProject: (value: TProject) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
