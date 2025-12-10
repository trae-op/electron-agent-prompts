import { memo } from "react";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";

import { useProjectsActions } from "../hooks";
import { ProjectsGrid } from "./ProjectsGrid";
import { useProjectsSelector, useProjectsLoadingSelector } from "../context";
import Typography from "@mui/material/Typography";
import { useClosePreloadWindow } from "@hooks/closePreloadWindow";

export const ProjectsOverview = memo(() => {
  useClosePreloadWindow();
  const projects = useProjectsSelector();
  const isLoading = useProjectsLoadingSelector();
  const { handleOpenProject, handleEditProject, handleDeleteProject } =
    useProjectsActions();

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
