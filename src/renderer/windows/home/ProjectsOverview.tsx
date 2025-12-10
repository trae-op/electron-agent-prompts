import { memo, useCallback } from "react";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";

import { useProjectsActions } from "@conceptions/Projects/hooks";
import { ProjectsGrid } from "@conceptions/Projects/components/ProjectsGrid";
import {
  useProjectsSelector,
  useProjectsLoadingSelector,
} from "@conceptions/Projects/context";
import Typography from "@mui/material/Typography";
import { useClosePreloadWindow } from "@hooks/closePreloadWindow";

export const ProjectsOverview = memo(() => {
  useClosePreloadWindow();
  const projects = useProjectsSelector();
  const isLoading = useProjectsLoadingSelector();
  const { handleOpenProject, handleDeleteProject } = useProjectsActions();

  const handleEditProject = useCallback((project: TProject) => {
    console.info("[Projects] Edit project", project.id);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Stack
      spacing={3}
      width="100%"
      height="100%"
      sx={
        projects.length === 0
          ? {
              alignItems: "center",
              justifyContent: "center",
            }
          : undefined
      }
      data-testid="projects-overview"
    >
      {projects.length === 0 ? (
        <Typography variant="h5" color="text.secondary">
          Not found any projects!
        </Typography>
      ) : (
        <ProjectsGrid
          projects={projects}
          onOpen={handleOpenProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}
    </Stack>
  );
});

ProjectsOverview.displayName = "ProjectsOverview";
