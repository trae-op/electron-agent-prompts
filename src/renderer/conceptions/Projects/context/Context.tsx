import { createContext, useCallback, useRef } from "react";
import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

const cloneProjects = (value: readonly TProject[]): TProject[] => {
  return value.map((project) => ({
    ...project,
    created: new Date(project.created),
    updated: new Date(project.updated),
  }));
};

export function Provider({
  children,
  initialProjects,
  initialIsLoading,
}: TProviderProps) {
  const projects = useRef<TProject[]>(cloneProjects(initialProjects ?? []));
  const isProjectsLoading = useRef<boolean>(initialIsLoading ?? true);
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getProjects = useCallback((): TProject[] => {
    return projects.current;
  }, []);

  const getProjectsLoading = useCallback((): boolean => {
    return isProjectsLoading.current;
  }, []);

  const setProjectsLoading = useCallback((value: boolean): void => {
    isProjectsLoading.current = value;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const setProjects = useCallback((value: TProject[]): void => {
    projects.current = cloneProjects(value);
    subscribers.current.forEach((callback) => callback());
  }, []);

  const addNewProject = useCallback((value: TProject): void => {
    projects.current = [...projects.current, ...cloneProjects([value])];
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
        setProjectsLoading,
        getProjectsLoading,
        addNewProject,
        setProjects,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
