import { useSyncExternalStore } from "react";

import { useCreateProjectContext } from "./useContext";

export const useCreateProjectModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useCreateProjectContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useLatestCreatedProjectSelector = (): TProject | undefined => {
  const { getLatestProject, subscribe } = useCreateProjectContext();

  return useSyncExternalStore(subscribe, getLatestProject, getLatestProject);
};

export const useSetCreateProjectModalOpenDispatch = () => {
  return useCreateProjectContext().setIsOpen;
};

export const useSetLatestCreatedProjectDispatch = () => {
  return useCreateProjectContext().setLatestProject;
};
