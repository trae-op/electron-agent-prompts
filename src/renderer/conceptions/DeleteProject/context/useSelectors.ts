import { useSyncExternalStore } from "react";

import { useDeleteProjectContext } from "./useContext";

export const useDeleteProjectModalProjectSelector = ():
  | TProject
  | undefined => {
  const { getProject, subscribe } = useDeleteProjectContext();

  return useSyncExternalStore(subscribe, getProject, getProject);
};

export const useSetDeleteProjectModalProjectDispatch = () => {
  return useDeleteProjectContext().setProject;
};
