import { useEffect, useCallback } from "react";
import {
  useSetProjectsDispatch,
  useSetProjectsLoadingDispatch,
} from "../context/useSelectors";

export const ProjectsSubscriber = () => {
  const setProjects = useSetProjectsDispatch();
  const setProjectsLoading = useSetProjectsLoadingDispatch();

  const subscribeUpdateApp = useCallback(() => {
    return window.electron.receive.subscribeProjects(({ projects }) => {
      setProjects(projects);
      setProjectsLoading(false);
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
