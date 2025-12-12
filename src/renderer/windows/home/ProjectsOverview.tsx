import { memo, useCallback } from "react";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";

import { ProjectList } from "@conceptions/Projects/components/ProjectList";
import {
  useProjectsSelector,
  useProjectsLoadingSelector,
} from "@conceptions/Projects/context";
import Typography from "@mui/material/Typography";
import { useClosePreloadWindow } from "@hooks/closePreloadWindow";
import { useUpdateProjectModalActions } from "@conceptions/UpdateProject";
import { useDeleteProjectModalActions } from "@conceptions/DeleteProject";
import { CreateProjectButton } from "@conceptions/CreateProject";
import Box from "@mui/material/Box";

export const ProjectsOverview = memo(() => {
  useClosePreloadWindow();
  const projects = useProjectsSelector();
  const isLoading = useProjectsLoadingSelector();
  const { openModal: openUpdateProjectModal } = useUpdateProjectModalActions();
  const { openModal: openDeleteProjectModal } = useDeleteProjectModalActions();

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
      openDeleteProjectModal(project);
    },
    [openDeleteProjectModal]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box width={300}>
      <CreateProjectButton />
      <Stack
        height="calc(100vh - 95px)"
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
        data-testid="projects-overview"
      >
        {projects.length === 0 ? (
          <Typography variant="h5" color="text.secondary">
            Not found any projects!
          </Typography>
        ) : (
          <ProjectList
            projects={projects}
            onOpen={handleOpenProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        )}
      </Stack>
    </Box>
  );
});

ProjectsOverview.displayName = "ProjectsOverview";
