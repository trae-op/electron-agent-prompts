import { useSyncExternalStore } from "react";

import { useUpdateTaskContext } from "./useContext";

export const useUpdateTaskModalTaskSelector = ():
  | TTaskWithFoldersContent
  | undefined => {
  const { getTask, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getTask, getTask);
};

export const useSetUpdateTaskModalTaskDispatch = () => {
  return useUpdateTaskContext().setTask;
};
