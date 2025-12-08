import { useCallback, useMemo } from "react";

import type { TProjectActionsHook } from "./types";

export const useProjectsActions = (): TProjectActionsHook => {
  const handleCreateProject = useCallback(() => {
    console.info("[Projects] Create project requested");
  }, []);

  const handleOpenProject = useCallback((project: TProject) => {
    console.info("[Projects] Open project", project.id);
  }, []);

  const handleEditProject = useCallback((project: TProject) => {
    console.info("[Projects] Edit project", project.id);
  }, []);

  const handleDeleteProject = useCallback((project: TProject) => {
    console.info("[Projects] Delete project", project.id);
  }, []);

  return useMemo(
    () => ({
      handleCreateProject,
      handleOpenProject,
      handleEditProject,
      handleDeleteProject,
    }),
    [
      handleCreateProject,
      handleOpenProject,
      handleEditProject,
      handleDeleteProject,
    ]
  );
};
