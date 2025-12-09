import { createContext, useCallback, useRef } from "react";

import { PROJECTS_SOURCE } from "../../../constants";
import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

const cloneProjects = (value: readonly TProject[]): TProject[] => {
  return value.map((project) => ({
    ...project,
    created: new Date(project.created),
    updated: new Date(project.updated),
  }));
};

export function Provider({ children, initialProjects }: TProviderProps) {
  const projects = useRef<TProject[]>(
    cloneProjects(initialProjects ?? PROJECTS_SOURCE)
  );
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getProjects = useCallback((): TProject[] => {
    return projects.current;
  }, []);

  const setProjects = useCallback((value: TProject[]): void => {
    projects.current = cloneProjects(value);
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
        getProjects,
        setProjects,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
