import { createContext, ReactElement, useCallback, useRef } from "react";

import type {
  TContext,
  TPopoverContext,
  TPopoverProviderProps,
  TProviderProps,
  TSubscriberCallback,
} from "./type";

export const Context = createContext<TContext | null>(null);
export const PopoverContext = createContext<TPopoverContext | null>(null);

export function PopoverProvider({
  children,
  renderButtonUpdateApp,
  renderButtonLogout,
  isNewVersionApp,
}: TPopoverProviderProps) {
  const ButtonLogout = useRef<ReactElement | null>(renderButtonLogout);
  const ButtonUpdateApp = useRef<ReactElement | null>(renderButtonUpdateApp);
  const versionApp = useRef<boolean | undefined>(isNewVersionApp);

  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getNewVersionApp = useCallback((): boolean | undefined => {
    return versionApp.current;
  }, []);

  const getRenderButtonUpdateApp = useCallback((): ReactElement | null => {
    return ButtonUpdateApp.current;
  }, []);

  const getRenderButtonLogout = useCallback((): ReactElement | null => {
    return ButtonLogout.current;
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);

    return (): void => {
      subscribers.current.delete(callback);
    };
  }, []);

  return (
    <PopoverContext.Provider
      value={{
        getRenderButtonUpdateApp,
        getRenderButtonLogout,
        getNewVersionApp,
        subscribe,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

export function Provider({ children }: TProviderProps) {
  const user = useRef<TUser | undefined>(undefined);
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getUser = useCallback((): TUser | undefined => {
    return user.current;
  }, []);

  const setUser = useCallback((value: TUser | undefined): void => {
    user.current = value;
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
        getUser,
        setUser,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
