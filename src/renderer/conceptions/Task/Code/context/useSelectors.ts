import { useSyncExternalStore } from "react";

import { useCodeContext } from "./useContext";

export const useCodeModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useCodeContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useCodeContentValueSelector = (): TMarkdownContent | undefined => {
  const { getContent, subscribe } = useCodeContext();

  return useSyncExternalStore(subscribe, getContent, getContent);
};

export const useSetCodeModalOpenDispatch = () => {
  return useCodeContext().setIsOpen;
};

export const useSetCodeContentDispatch = () => {
  return useCodeContext().setContent;
};
