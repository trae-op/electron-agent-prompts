import { useSyncExternalStore } from "react";

import { useTitleContext } from "./useContext";

export const useTitleModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useTitleContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useContentValueSelector = (): TMarkdownContent | undefined => {
  const { getContent, subscribe } = useTitleContext();

  return useSyncExternalStore(subscribe, getContent, getContent);
};

export const useSetTitleModalOpenDispatch = () => {
  return useTitleContext().setIsOpen;
};

export const useSetContentDispatch = () => {
  return useTitleContext().setContent;
};
