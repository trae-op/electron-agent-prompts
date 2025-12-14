import { useSyncExternalStore } from "react";

import { useUpdateProjectContext } from "./useContext";

export const useUpdateProjectModalProjectSelector = ():
  | TProject
  | undefined => {
  const { getProject, subscribe } = useUpdateProjectContext();

  return useSyncExternalStore(subscribe, getProject, getProject);
};

export const useSetUpdateProjectModalProjectDispatch = () => {
  return useUpdateProjectContext().setProject;
};
