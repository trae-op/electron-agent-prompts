import { useCallback, useMemo } from "react";

import type { TProjectActionsHook } from "./types";

export const useProjectsActions = (): TProjectActionsHook => {
  const handleOpenProject = useCallback((project: TProject) => {
    console.info("[Projects] Open project", project.id);
  }, []);

  const handleDeleteProject = useCallback((project: TProject) => {
    console.info("[Projects] Delete project", project.id);
  }, []);

  return useMemo(
    () => ({
      handleOpenProject,
      handleDeleteProject,
    }),
    [handleOpenProject, handleDeleteProject]
  );
};
