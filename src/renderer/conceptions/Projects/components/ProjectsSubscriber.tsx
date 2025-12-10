import { useEffect, useCallback } from "react";
import { useSetProjectsDispatch } from "../context/useSelectors";

export const ProjectsSubscriber = () => {
  const setProjects = useSetProjectsDispatch();

  const subscribeUpdateApp = useCallback(() => {
    return window.electron.receive.subscribeProjects(({ projects }) => {
      setProjects(projects);
    });
  }, []);

  useEffect(() => {
    window.electron.send.projects();
  }, []);

  useEffect(() => {
    const unSub = subscribeUpdateApp();

    return unSub;
  }, []);

  return null;
};
