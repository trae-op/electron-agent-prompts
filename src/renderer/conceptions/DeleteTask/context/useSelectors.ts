import { useSyncExternalStore } from "react";

import { useDeleteTaskContext } from "./useContext";

export const useDeleteTaskModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useDeleteTaskContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useDeleteTaskModalTaskSelector = (): TTask | undefined => {
  const { getTask, subscribe } = useDeleteTaskContext();

  return useSyncExternalStore(subscribe, getTask, getTask);
};

export const useSetDeleteTaskModalOpenDispatch = () => {
  return useDeleteTaskContext().setIsOpen;
};

export const useSetDeleteTaskModalTaskDispatch = () => {
  return useDeleteTaskContext().setTask;
};
