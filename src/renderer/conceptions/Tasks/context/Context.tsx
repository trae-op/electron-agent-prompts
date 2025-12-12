import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

const cloneTasks = (value: readonly TTask[]): TTask[] => {
  return value.map((task) => ({
    ...task,
    created: new Date(task.created),
    updated: new Date(task.updated),
  }));
};

export function Provider({
  children,
  initialTasks,
  initialIsLoading,
}: TProviderProps) {
  const tasks = useRef<TTask[]>(cloneTasks(initialTasks ?? []));
  const isTasksLoading = useRef<boolean>(initialIsLoading ?? true);
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getTasks = useCallback((): TTask[] => {
    return tasks.current;
  }, []);

  const getTasksLoading = useCallback((): boolean => {
    return isTasksLoading.current;
  }, []);

  const setTasksLoading = useCallback((value: boolean): void => {
    isTasksLoading.current = value;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const setTasks = useCallback((value: TTask[]): void => {
    tasks.current = cloneTasks(value);
    subscribers.current.forEach((callback) => callback());
  }, []);

  const addNewTask = useCallback((value: TTask): void => {
    tasks.current = [...tasks.current, ...cloneTasks([value])];
    subscribers.current.forEach((callback) => callback());
  }, []);

  const updateTask = useCallback((value: TTask): void => {
    const [nextTask] = cloneTasks([value]);
    tasks.current = tasks.current.map((task) =>
      task.id === nextTask.id ? nextTask : task
    );
    subscribers.current.forEach((callback) => callback());
  }, []);

  const removeTask = useCallback((taskId: number): void => {
    tasks.current = tasks.current.filter((task) => task.id !== taskId);
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);

    return (): void => {
      subscribers.current.delete(callback);
    };
  }, []);

  return (
    <Context.Provider
      value={{
        getTasks,
        setTasksLoading,
        getTasksLoading,
        addNewTask,
        updateTask,
        removeTask,
        setTasks,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
