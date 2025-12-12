import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const isOpen = useRef<boolean>(false);
  const latestTask = useRef<TTask | undefined>(undefined);
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

  const getLatestTask = useCallback((): TTask | undefined => {
    return latestTask.current;
  }, []);

  const setLatestTask = useCallback((value: TTask | undefined): void => {
    latestTask.current = value;
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
        getLatestTask,
        setLatestTask,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
