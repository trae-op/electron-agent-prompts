import { useSyncExternalStore } from "react";

import { useTasksContext } from "./useContext";

export const useTasksSelector = (): TTask[] => {
  const { getTasks, subscribe } = useTasksContext();

  return useSyncExternalStore(subscribe, getTasks, getTasks);
};

export const useTasksLoadingSelector = (): boolean => {
  const { getTasksLoading, subscribe } = useTasksContext();

  return useSyncExternalStore(subscribe, getTasksLoading, getTasksLoading);
};

export const useSetTasksDispatch = () => {
  return useTasksContext().setTasks;
};

export const useSetTasksLoadingDispatch = () => {
  return useTasksContext().setTasksLoading;
};

export const useAddNewTaskDispatch = () => {
  return useTasksContext().addNewTask;
};

export const useUpdateTaskDispatch = () => {
  return useTasksContext().updateTask;
};

export const useRemoveTaskDispatch = () => {
  return useTasksContext().removeTask;
};
