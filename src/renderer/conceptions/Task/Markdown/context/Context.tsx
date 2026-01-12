import { createContext, useCallback, useRef } from "react";

import { changePosition, clamp } from "@utils/markdownContent";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children, items }: TProviderProps) {
  const contents = useRef<TMarkdownContent[]>(sortContents(items ?? []));
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getContents = useCallback((): TMarkdownContent[] => {
    return contents.current;
  }, []);

  const setContents = useCallback((value: TMarkdownContent[]): void => {
    contents.current = sortContents(value);
    subscribers.current.forEach((callback) => callback());
  }, []);

  const addContent = useCallback((value: TMarkdownContent): void => {
    const previous = sortContents(
      contents.current.filter((item) => item.id !== value.id)
    );
    const next = [...previous, value];

    const desiredIndex = clamp(value.position, 0, previous.length);
    const result = changePosition(next, value.id, desiredIndex + 1);

    contents.current = result.ok ? result.value : sortContents(next);
    subscribers.current.forEach((callback) => callback());
  }, []);

  const updateContent = useCallback((value: TMarkdownContent): void => {
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

function sortContents(list: TMarkdownContent[]): TMarkdownContent[] {
  return [...list].sort((first, second) => first.position - second.position);
}
