import { useCallback } from "react";

import {
  useSetDeleteProjectModalOpenDispatch,
  useSetDeleteProjectModalProjectDispatch,
} from "../context";

export const useDeleteProjectModalActions = () => {
  const setIsOpen = useSetDeleteProjectModalOpenDispatch();
  const setProject = useSetDeleteProjectModalProjectDispatch();

  const openModal = useCallback(
    (project: TProject) => {
      setProject(undefined);
      setIsOpen(true);
      setProject(project);
    },
    [setIsOpen, setProject]
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setProject(undefined);
  }, [setIsOpen, setProject]);

  return {
    openModal,
    closeModal,
  };
};
