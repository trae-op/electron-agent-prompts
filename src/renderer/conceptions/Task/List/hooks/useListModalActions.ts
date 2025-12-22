import { useCallback } from "react";

import { useSetListModalOpenDispatch } from "../context";

export const useListModalActions = () => {
  const setIsOpen = useSetListModalOpenDispatch();

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
