import { createContext, useCallback, useRef } from "react";

import {
  type TContext,
  type TProviderProps,
  type TSearchResult,
  type TSearchState,
  type TSubscriberCallback,
} from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children, initialQuery }: TProviderProps) {
  const state = useRef<TSearchState>(createInitialState(initialQuery));
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getState = useCallback((): TSearchState => {
    return state.current;
  }, []);

  const setQuery = useCallback((value: string): void => {
    if (state.current.query === value) {
      return;
    }

    state.current = {
      ...state.current,
      query: value,
    };
    subscribers.current.forEach((callback) => callback());
  }, []);

  const setSearchResult = useCallback((result: TSearchResult): void => {
    state.current = {
      ...state.current,
      activeMatchOrdinal: Math.max(0, result.activeMatchOrdinal),
      matches: Math.max(0, result.matches),
    };
    subscribers.current.forEach((callback) => callback());
  }, []);

  const reset = useCallback((): void => {
    state.current = createInitialState();
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
        getState,
        setQuery,
        setSearchResult,
        reset,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}

function createInitialState(query?: string): TSearchState {
  return {
    query: query ?? "",
    matches: 0,
    activeMatchOrdinal: 0,
  };
}
