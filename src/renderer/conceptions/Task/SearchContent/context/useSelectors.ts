import { useSyncExternalStore } from "react";

import { useSearchContentContext } from "./useContext";
import { type TSearchResult, type TSearchState } from "./types";

export const useSearchStateSelector = (): TSearchState => {
  const { getState, subscribe } = useSearchContentContext();

  return useSyncExternalStore(subscribe, getState, getState);
};

export const useSearchQuerySelector = (): string => {
  const { getState, subscribe } = useSearchContentContext();
  const getSnapshot = () => getState().query;

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

export const useSearchResultSelector = (): TSearchResult => {
  const { getState, subscribe } = useSearchContentContext();
  const snapshot = useSyncExternalStore(subscribe, getState, getState);

  return {
    activeMatchOrdinal: snapshot.activeMatchOrdinal,
    matches: snapshot.matches,
  } satisfies TSearchResult;
};

export const useSetSearchQueryDispatch = () => {
  return useSearchContentContext().setQuery;
};

export const useSetSearchResultDispatch = () => {
  return useSearchContentContext().setSearchResult;
};

export const useResetSearchDispatch = () => {
  return useSearchContentContext().reset;
};
