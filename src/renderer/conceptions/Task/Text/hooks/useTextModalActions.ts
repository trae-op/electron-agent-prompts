import { useCallback } from "react";

import { useSetTextModalOpenDispatch } from "../context";

export const useTextModalActions = () => {
  const setIsOpen = useSetTextModalOpenDispatch();

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
