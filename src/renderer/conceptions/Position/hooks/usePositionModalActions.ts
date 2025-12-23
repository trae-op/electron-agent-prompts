import { useCallback } from "react";

import { useSetPositionModalOpenDispatch } from "../context";

export const usePositionModalActions = () => {
  const setIsOpen = useSetPositionModalOpenDispatch();

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
