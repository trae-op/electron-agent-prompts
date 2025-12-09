import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const isOpen = useRef<boolean>(false);
  const latestProject = useRef<TProject | undefined>(undefined);
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getIsOpen = useCallback((): boolean => {
    return isOpen.current;
  }, []);

  const setIsOpen = useCallback((value: boolean): void => {
    if (isOpen.current === value) {
      return;
    }

    isOpen.current = value;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const getLatestProject = useCallback((): TProject | undefined => {
    return latestProject.current;
  }, []);

  const setLatestProject = useCallback((value: TProject | undefined): void => {
    latestProject.current = value;
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
        getIsOpen,
        setIsOpen,
        getLatestProject,
        setLatestProject,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
