import { useSyncExternalStore } from "react";

import { useDeleteTaskContext } from "./useContext";

export const useDeleteTaskModalTaskSelector = (): TTask | undefined => {
  const { getTask, subscribe } = useDeleteTaskContext();

  return useSyncExternalStore(subscribe, getTask, getTask);
};

export const useSetDeleteTaskModalTaskDispatch = () => {
  return useDeleteTaskContext().setTask;
};
