import { useSyncExternalStore } from "react";

import { usePositionContext } from "./useContext";

export const usePositionModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = usePositionContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const usePositionContentValueSelector = ():
  | TMarkdownContent
  | undefined => {
  const { getContent, subscribe } = usePositionContext();

  return useSyncExternalStore(subscribe, getContent, getContent);
};

export const useSetPositionModalOpenDispatch = () => {
  return usePositionContext().setIsOpen;
};

export const useSetPositionContentDispatch = () => {
  return usePositionContext().setContent;
};
