import { useSyncExternalStore } from "react";

import { useListContext } from "./useContext";

export const useListModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useListContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useListContentValueSelector = (): TMarkdownContent | undefined => {
  const { getContent, subscribe } = useListContext();

  return useSyncExternalStore(subscribe, getContent, getContent);
};

export const useSetListModalOpenDispatch = () => {
  return useListContext().setIsOpen;
};

export const useSetListContentDispatch = () => {
  return useListContext().setContent;
};
