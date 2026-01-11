import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const task = useRef<TTask | undefined>(undefined);
  const projects = useRef<TProject[]>([]);
  const ide = useRef<string | undefined>(undefined);
  const isSkills = useRef<boolean>(false);

  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getTask = useCallback((): TTask | undefined => {
    return task.current;
  }, []);

  const setTask = useCallback((value: TTask | undefined): void => {
    task.current = value;

    if (value === undefined) {
      ide.current = undefined;
      isSkills.current = false;
    } else {
      ide.current = value.ide;
      isSkills.current = value.isSkills === true;
    }

    subscribers.current.forEach((callback) => callback());
  }, []);

  const getProjects = useCallback((): TProject[] => {
    return projects.current;
  }, []);

  const setProjects = useCallback((value: TProject[]): void => {
    projects.current = value;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const getIde = useCallback((): string | undefined => {
    return ide.current;
  }, []);

  const setIde = useCallback((value: string | undefined): void => {
    ide.current = value;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const getIsSkills = useCallback((): boolean => {
    return isSkills.current;
  }, []);

  const setIsSkills = useCallback((value: boolean): void => {
    isSkills.current = value;
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
        getIde,
        setIde,
        getIsSkills,
        setIsSkills,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
