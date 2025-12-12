import { useEffect, useCallback } from "react";
import {
  useSetTasksDispatch,
  useSetTasksLoadingDispatch,
} from "../context/useSelectors";

export const TasksSubscriber = () => {
  const setTasks = useSetTasksDispatch();
  const setTasksLoading = useSetTasksLoadingDispatch();

  const subscribeTasks = useCallback(() => {
    return window.electron.receive.subscribeTasks(({ tasks }) => {
      setTasks(tasks);
      setTasksLoading(false);
    });
  }, [setTasks, setTasksLoading]);

  useEffect(() => {
    window.electron.send.tasks();
  }, []);

  useEffect(() => {
    const unSub = subscribeTasks();

    return unSub;
  }, [subscribeTasks]);

  return null;
};
