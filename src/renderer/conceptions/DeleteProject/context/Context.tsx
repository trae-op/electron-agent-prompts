import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const project = useRef<TProject | undefined>(undefined);
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getProject = useCallback((): TProject | undefined => {
    return project.current;
  }, []);

  const setProject = useCallback((value: TProject | undefined): void => {
    project.current = value;
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
        getProject,
        setProject,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
