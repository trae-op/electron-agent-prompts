import { useCallback } from "react";

import {
  useCreateProjectModalOpenSelector,
  useSetCreateProjectModalOpenDispatch,
  useSetLatestCreatedProjectDispatch,
} from "../context";

export const useCreateProjectModal = () => {
  const isOpen = useCreateProjectModalOpenSelector();
  const setIsOpen = useSetCreateProjectModalOpenDispatch();
  const setLatestProject = useSetLatestCreatedProjectDispatch();

  const openModal = useCallback(() => {
    setLatestProject(undefined);
    setIsOpen(true);
  }, [setIsOpen, setLatestProject]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setLatestProject(undefined);
  }, [setIsOpen, setLatestProject]);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
