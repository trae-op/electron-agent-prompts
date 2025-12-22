import { useSetProjectsDispatch } from "@conceptions/Projects";
import { useSetTasksDispatch, useUpdateTaskDispatch } from "@conceptions/Tasks";
import { useCallback, useEffect } from "react";

export const Subscriber = () => {
  const setTasks = useSetTasksDispatch();
  const setProjects = useSetProjectsDispatch();
  const updateTask = useUpdateTaskDispatch();

  const subscribeTasks = useCallback(() => {
    return window.electron.receive.subscribeTasks(({ tasks }) => {
      setTasks(tasks);
    });
  }, []);

  const subscribeProjects = useCallback(() => {
    return window.electron.receive.subscribeProjects(({ projects }) => {
      setProjects(projects);
    });
  }, []);

  const subscribeUpdateTask = useCallback(() => {
    return window.electron.receive.subscribeUpdateTask(({ task }) => {
      updateTask(task);
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

  useEffect(() => {
    const unSub = subscribeUpdateTask();

    return unSub;
  }, []);

  return null;
};
