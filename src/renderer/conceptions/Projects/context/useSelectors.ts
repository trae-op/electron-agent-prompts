import { useSyncExternalStore } from "react";

import { useProjectsContext } from "./useContext";

export const useProjectsSelector = (): TProject[] => {
  const { getProjects, subscribe } = useProjectsContext();

  return useSyncExternalStore(subscribe, getProjects, getProjects);
};

export const useSetProjectsDispatch = () => {
  return useProjectsContext().setProjects;
};

export const useAddNewProjectDispatch = () => {
  return useProjectsContext().addNewProject;
};
