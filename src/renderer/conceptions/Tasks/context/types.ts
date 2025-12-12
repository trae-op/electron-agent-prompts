import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren<{
  initialTasks?: TTask[];
  initialIsLoading?: boolean;
}>;

export type TSubscriberCallback = () => void;

export type TContext = {
  getTasks: () => TTask[];
  getTasksLoading: () => boolean;
  setTasksLoading: (value: boolean) => void;
  setTasks: (value: TTask[]) => void;
  addNewTask: (value: TTask) => void;
  updateTask: (value: TTask) => void;
  removeTask: (taskId: number) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
