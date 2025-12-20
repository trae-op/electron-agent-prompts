import { useCallback } from "react";

import { useSetTitleModalOpenDispatch } from "../context";

export const useTitleModalActions = () => {
  const setIsOpen = useSetTitleModalOpenDispatch();
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
