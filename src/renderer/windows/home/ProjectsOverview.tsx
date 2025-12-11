import { memo, useCallback } from "react";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";

import { ProjectsGrid } from "@conceptions/Projects/components/ProjectsGrid";
import {
  useProjectsSelector,
  useProjectsLoadingSelector,
} from "@conceptions/Projects/context";
import Typography from "@mui/material/Typography";
import { useClosePreloadWindow } from "@hooks/closePreloadWindow";
import { useUpdateProjectModalActions } from "@conceptions/UpdateProject";

export const ProjectsOverview = memo(() => {
  useClosePreloadWindow();
  const projects = useProjectsSelector();
  const isLoading = useProjectsLoadingSelector();
  const { openModal: openUpdateProjectModal } = useUpdateProjectModalActions();

  const handleEditProject = useCallback(
    (project: TProject) => {
      openUpdateProjectModal(project);
    },
    [openUpdateProjectModal]
  );

  const handleOpenProject = useCallback(
    (project: TProject) => {
      console.info("Open project", project.id);
    },
    [openUpdateProjectModal]
  );

  const handleDeleteProject = useCallback(
    (project: TProject) => {
      console.info("Delete project", project.id);
    },
    [openUpdateProjectModal]
  );

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
