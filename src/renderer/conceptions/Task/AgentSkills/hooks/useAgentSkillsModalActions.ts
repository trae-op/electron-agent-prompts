import { useCallback } from "react";

import { useSetAgentSkillsModalOpenDispatch } from "../context";

export const useAgentSkillsModalActions = () => {
  const setIsOpen = useSetAgentSkillsModalOpenDispatch();

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
