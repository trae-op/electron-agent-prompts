import { useCallback } from "react";

import {
  useSetUpdateProjectModalOpenDispatch,
  useSetUpdateProjectModalProjectDispatch,
} from "../context";

export const useUpdateProjectModalActions = () => {
  const setIsOpen = useSetUpdateProjectModalOpenDispatch();
  const setProject = useSetUpdateProjectModalProjectDispatch();

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
