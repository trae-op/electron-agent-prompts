import { useSyncExternalStore } from "react";

import { useUpdateProjectContext } from "./useContext";

export const useUpdateProjectModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useUpdateProjectContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useUpdateProjectModalProjectSelector = ():
  | TProject
  | undefined => {
  const { getProject, subscribe } = useUpdateProjectContext();

  return useSyncExternalStore(subscribe, getProject, getProject);
};

export const useSetUpdateProjectModalOpenDispatch = () => {
  return useUpdateProjectContext().setIsOpen;
};

export const useSetUpdateProjectModalProjectDispatch = () => {
  return useUpdateProjectContext().setProject;
};
