import { useSyncExternalStore } from "react";

import { useTextContext } from "./useContext";

export const useTextModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useTextContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useTextContentValueSelector = (): TMarkdownContent | undefined => {
  const { getContent, subscribe } = useTextContext();

  return useSyncExternalStore(subscribe, getContent, getContent);
};

export const useSetTextModalOpenDispatch = () => {
  return useTextContext().setIsOpen;
};

export const useSetTextContentDispatch = () => {
  return useTextContext().setContent;
};
