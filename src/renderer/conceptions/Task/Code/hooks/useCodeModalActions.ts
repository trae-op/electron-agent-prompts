import { useCallback } from "react";

import { useSetCodeModalOpenDispatch } from "../context";

export const useCodeModalActions = () => {
  const setIsOpen = useSetCodeModalOpenDispatch();

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
