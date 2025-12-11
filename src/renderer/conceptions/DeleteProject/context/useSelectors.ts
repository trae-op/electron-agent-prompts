import { useSyncExternalStore } from "react";

import { useDeleteProjectContext } from "./useContext";

export const useDeleteProjectModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useDeleteProjectContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useDeleteProjectModalProjectSelector = ():
  | TProject
  | undefined => {
  const { getProject, subscribe } = useDeleteProjectContext();

  return useSyncExternalStore(subscribe, getProject, getProject);
};

export const useSetDeleteProjectModalOpenDispatch = () => {
  return useDeleteProjectContext().setIsOpen;
};

export const useSetDeleteProjectModalProjectDispatch = () => {
  return useDeleteProjectContext().setProject;
};
