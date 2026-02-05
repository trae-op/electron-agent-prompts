import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const isOpen = useRef<boolean>(false);
  const latestTask = useRef<TTask | undefined>(undefined);
  const isSettings = useRef<boolean>(true);
  const isSkills = useRef<boolean>(false);
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

  const getIsSettings = useCallback((): boolean => {
    return isSettings.current;
  }, []);

  const setIsSettings = useCallback((value: boolean): void => {
    if (isSettings.current === value) {
      return;
    }

    isSettings.current = value;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const getIsSkills = useCallback((): boolean => {
    return isSkills.current;
  }, []);

  const setIsSkills = useCallback((value: boolean): void => {
    if (isSkills.current === value) {
      return;
    }

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
        getIsOpen,
        setIsOpen,
        getLatestTask,
        setLatestTask,
        getIsSettings,
        setIsSettings,
        getIsSkills,
        setIsSkills,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
