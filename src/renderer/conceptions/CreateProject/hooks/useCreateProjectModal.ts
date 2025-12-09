import { useCallback } from "react";

import {
  useCreateProjectModalOpen,
  useSetCreateProjectModalOpen,
  useSetLatestCreatedProject,
} from "../context";

export const useCreateProjectModal = () => {
  const isOpen = useCreateProjectModalOpen();
  const setIsOpen = useSetCreateProjectModalOpen();
  const setLatestProject = useSetLatestCreatedProject();

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
