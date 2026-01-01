import { type PropsWithChildren } from "react";

export type TSearchResult = {
  activeMatchOrdinal: number;
  matches: number;
};

export type TSearchState = TSearchResult & {
  query: string;
};

export type TSubscriberCallback = () => void;

export type TContext = {
  getState: () => TSearchState;
  setQuery: (value: string) => void;
  setSearchResult: (result: TSearchResult) => void;
  reset: () => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TProviderProps = PropsWithChildren<{
  initialQuery?: string;
}>;
