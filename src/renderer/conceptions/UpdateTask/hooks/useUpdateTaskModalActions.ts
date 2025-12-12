import { useCallback } from "react";

import {
  useSetUpdateTaskModalOpenDispatch,
  useSetUpdateTaskModalTaskDispatch,
} from "../context";

export const useUpdateTaskModalActions = () => {
  const setIsOpen = useSetUpdateTaskModalOpenDispatch();
  const setTask = useSetUpdateTaskModalTaskDispatch();

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
