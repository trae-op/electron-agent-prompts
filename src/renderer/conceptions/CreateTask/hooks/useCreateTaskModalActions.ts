import { useCallback } from "react";

import {
  useSetCreateTaskModalOpenDispatch,
  useSetLatestCreatedTaskDispatch,
} from "../context";

export const useCreateTaskModalActions = () => {
  const setIsOpen = useSetCreateTaskModalOpenDispatch();
  const setLatestTask = useSetLatestCreatedTaskDispatch();

  const openModal = useCallback(() => {
    setLatestTask(undefined);
    setIsOpen(true);
  }, [setIsOpen, setLatestTask]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setLatestTask(undefined);
  }, [setIsOpen, setLatestTask]);

  return {
    openModal,
    closeModal,
  };
};
