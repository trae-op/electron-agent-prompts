import { useSyncExternalStore } from "react";

import { useUpdateTaskContext } from "./useContext";

export const useUpdateTaskModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useUpdateTaskModalTaskSelector = (): TTask | undefined => {
  const { getTask, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getTask, getTask);
};

export const useSetUpdateTaskModalOpenDispatch = () => {
  return useUpdateTaskContext().setIsOpen;
};

export const useSetUpdateTaskModalTaskDispatch = () => {
  return useUpdateTaskContext().setTask;
};
