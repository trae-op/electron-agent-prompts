import { useCallback } from "react";

import {
  useSetDeleteTaskModalOpenDispatch,
  useSetDeleteTaskModalTaskDispatch,
} from "../context";

export const useDeleteTaskModalActions = () => {
  const setIsOpen = useSetDeleteTaskModalOpenDispatch();
  const setTask = useSetDeleteTaskModalTaskDispatch();

  const openModal = useCallback(
    (task: TTask) => {
      setTask(undefined);
      setIsOpen(true);
      setTask(task);
    },
    [setIsOpen, setTask]
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTask(undefined);
  }, [setIsOpen, setTask]);

  return {
    openModal,
    closeModal,
  };
};
