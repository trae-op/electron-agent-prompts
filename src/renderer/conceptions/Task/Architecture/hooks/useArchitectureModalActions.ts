import { useCallback } from "react";

import { useSetArchitectureModalOpenDispatch } from "../context";

export const useArchitectureModalActions = () => {
  const setIsOpen = useSetArchitectureModalOpenDispatch();

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
