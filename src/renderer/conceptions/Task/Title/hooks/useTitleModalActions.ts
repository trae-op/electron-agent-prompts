import { useCallback } from "react";

import { useSetTitleDispatch, useSetTitleModalOpenDispatch } from "../context";

export const useTitleModalActions = () => {
  const setIsOpen = useSetTitleModalOpenDispatch();
  const setTitle = useSetTitleDispatch();

  const openModal = useCallback(
    (value = "") => {
      setTitle(value);
      setIsOpen(true);
    },
    [setIsOpen, setTitle]
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTitle("");
  }, [setIsOpen, setTitle]);

  return {
    openModal,
    closeModal,
  };
};
