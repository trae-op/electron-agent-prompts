import { useSyncExternalStore } from "react";

import { useUpdateTaskContext } from "./useContext";

export const useUpdateTaskModalTaskSelector = ():
  | TTaskWithFoldersContent
  | undefined => {
  const { getTask, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getTask, getTask);
};

export const useUpdateTaskModalProjectsSelector = (): TProject[] => {
  const { getProjects, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getProjects, getProjects);
};

export const useSetUpdateTaskModalProjectsDispatch = () => {
  return useUpdateTaskContext().setProjects;
};

export const useSetUpdateTaskModalTaskDispatch = () => {
  return useUpdateTaskContext().setTask;
};
