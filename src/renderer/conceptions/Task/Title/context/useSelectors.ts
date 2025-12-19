import { useSyncExternalStore } from "react";

import { useTitleContext } from "./useContext";

export const useTitleModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useTitleContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useTitleValueSelector = (): string => {
  const { getTitle, subscribe } = useTitleContext();

  return useSyncExternalStore(subscribe, getTitle, getTitle);
};

export const useSetTitleModalOpenDispatch = () => {
  return useTitleContext().setIsOpen;
};

export const useSetTitleDispatch = () => {
  return useTitleContext().setTitle;
};
