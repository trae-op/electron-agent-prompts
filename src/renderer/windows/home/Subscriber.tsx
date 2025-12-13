import { useSetProjectsDispatch } from "@conceptions/Projects";
import { useSetTasksDispatch } from "@conceptions/Tasks";
import { useCallback, useEffect } from "react";

export const Subscriber = () => {
  const setTasks = useSetTasksDispatch();
  const setProjects = useSetProjectsDispatch();

  const subscribeTasks = useCallback(() => {
    return window.electron.receive.subscribeTasks(({ tasks }) => {
      console.log("Received tasks update:", tasks);
      setTasks(tasks);
    });
  }, []);

  const subscribeProjects = useCallback(() => {
    return window.electron.receive.subscribeProjects(({ projects }) => {
      setProjects(projects);
    });
  }, []);

  useEffect(() => {
    window.electron.send.projects();
  }, []);

  useEffect(() => {
    const unSub = subscribeProjects();

    return unSub;
  }, []);

  useEffect(() => {
    const unSub = subscribeTasks();

    return unSub;
  }, []);

  return null;
};
