import { useSyncExternalStore } from "react";

import { useCreateTaskContext } from "./useContext";

export const useCreateTaskModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useCreateTaskContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useLatestCreatedTaskSelector = (): TTask | undefined => {
  const { getLatestTask, subscribe } = useCreateTaskContext();

  return useSyncExternalStore(subscribe, getLatestTask, getLatestTask);
};

export const useSetCreateTaskModalOpenDispatch = () => {
  return useCreateTaskContext().setIsOpen;
};

export const useSetLatestCreatedTaskDispatch = () => {
  return useCreateTaskContext().setLatestTask;
};
