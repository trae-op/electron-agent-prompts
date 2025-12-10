import { useSyncExternalStore } from "react";

import { useProjectsContext } from "./useContext";

export const useProjectsSelector = (): TProject[] => {
  const { getProjects, subscribe } = useProjectsContext();

  return useSyncExternalStore(subscribe, getProjects, getProjects);
};

export const useProjectsLoadingSelector = (): boolean => {
  const { getProjectsLoading, subscribe } = useProjectsContext();

  return useSyncExternalStore(
    subscribe,
    getProjectsLoading,
    getProjectsLoading
  );
};

export const useSetProjectsDispatch = () => {
  return useProjectsContext().setProjects;
};

export const useSetProjectsLoadingDispatch = () => {
  return useProjectsContext().setProjectsLoading;
};

export const useAddNewProjectDispatch = () => {
  return useProjectsContext().addNewProject;
};

export const useUpdateProjectDispatch = () => {
  return useProjectsContext().updateProject;
};
