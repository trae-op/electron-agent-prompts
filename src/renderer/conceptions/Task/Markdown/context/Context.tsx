import { createContext, useCallback, useRef } from "react";

import type {
  TContent,
  TContext,
  TProviderProps,
  TSubscriberCallback,
} from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children, items }: TProviderProps) {
  const contents = useRef<TContent[]>(sortContents(items ?? []));
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getContents = useCallback((): TContent[] => {
    return contents.current;
  }, []);

  const setContents = useCallback((value: TContent[]): void => {
    contents.current = sortContents(value);
    subscribers.current.forEach((callback) => callback());
  }, []);

  const addContent = useCallback((value: TContent): void => {
    const next = [
      ...contents.current.filter((item) => item.id !== value.id),
      value,
    ];
    contents.current = sortContents(next);
    subscribers.current.forEach((callback) => callback());
  }, []);

  const updateContent = useCallback((value: TContent): void => {
    contents.current = contents.current.map((content) =>
      content.id === value.id ? value : content
    );
    subscribers.current.forEach((callback) => callback());
  }, []);

  const deleteContent = useCallback((id: string): void => {
    contents.current = contents.current.filter((item) => item.id !== id);
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
        getContents,
        setContents,
        addContent,
        updateContent,
        deleteContent,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}

function sortContents(list: TContent[]): TContent[] {
  return [...list].sort((first, second) => first.position - second.position);
}
