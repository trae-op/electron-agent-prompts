import { useCallback } from "react";

import { useSetConverterModalOpenDispatch } from "../context";

export const useConverterModalActions = () => {
  const setIsOpen = useSetConverterModalOpenDispatch();

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    openModal,
    closeModal,
  };
};
