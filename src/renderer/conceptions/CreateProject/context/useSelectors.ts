import { useSyncExternalStore } from "react";

import { useCreateProjectContext } from "./useContext";

export const useCreateProjectModalOpen = (): boolean => {
  const { getIsOpen, subscribe } = useCreateProjectContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useLatestCreatedProject = (): TProject | undefined => {
  const { getLatestProject, subscribe } = useCreateProjectContext();

  return useSyncExternalStore(subscribe, getLatestProject, getLatestProject);
};

export const useSetCreateProjectModalOpen = () => {
  return useCreateProjectContext().setIsOpen;
};

export const useSetLatestCreatedProject = () => {
  return useCreateProjectContext().setLatestProject;
};
