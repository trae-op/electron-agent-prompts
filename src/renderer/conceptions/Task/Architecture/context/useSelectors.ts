import { useSyncExternalStore } from "react";

import { useArchitectureContext } from "./useContext";

export const useArchitectureModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useArchitectureContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useArchitectureContentValueSelector = ():
  | TMarkdownContent
  | undefined => {
  const { getContent, subscribe } = useArchitectureContext();

  return useSyncExternalStore(subscribe, getContent, getContent);
};

export const useSetArchitectureModalOpenDispatch = () => {
  return useArchitectureContext().setIsOpen;
};

export const useSetArchitectureContentDispatch = () => {
  return useArchitectureContext().setContent;
};
