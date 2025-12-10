import { useCallback } from "react";

import {
  useSetCreateProjectModalOpenDispatch,
  useSetLatestCreatedProjectDispatch,
} from "../context";

export const useCreateProjectModalActions = () => {
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
    openModal,
    closeModal,
  };
};
