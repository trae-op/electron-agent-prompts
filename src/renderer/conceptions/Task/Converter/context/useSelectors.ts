import { useSyncExternalStore } from "react";

import { useConverterContext } from "./useContext";

export const useConverterModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useConverterContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useConverterMarkdownValueSelector = (): string => {
  const { getMarkdownValue, subscribe } = useConverterContext();

  return useSyncExternalStore(subscribe, getMarkdownValue, getMarkdownValue);
};

export const useSetConverterModalOpenDispatch = () => {
  return useConverterContext().setIsOpen;
};

export const useSetConverterMarkdownDispatch = () => {
  return useConverterContext().setMarkdownValue;
};
