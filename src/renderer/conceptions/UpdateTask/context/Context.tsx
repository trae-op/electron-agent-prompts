import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const task = useRef<TTaskWithFoldersContent | undefined>(undefined);
  const projects = useRef<TProject[]>([]);

  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getTask = useCallback((): TTaskWithFoldersContent | undefined => {
    return task.current;
  }, []);

  const setTask = useCallback(
    (value: TTaskWithFoldersContent | undefined): void => {
      task.current = value;
      subscribers.current.forEach((callback) => callback());
    },
    []
  );

  const getProjects = useCallback((): TProject[] => {
    return projects.current;
  }, []);

  const setProjects = useCallback((value: TProject[]): void => {
    projects.current = value;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: TSubscriberCallback) => {
    subscribers.current.add(callback);

    return (): void => {
      subscribers.current.delete(callback);
    };
  }, []);

  return (
    <Context.Provider
      value={{
        getTask,
        getProjects,
        setProjects,
        setTask,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
