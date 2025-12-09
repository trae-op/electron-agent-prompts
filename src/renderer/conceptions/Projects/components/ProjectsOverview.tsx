import { memo, useMemo } from "react";
import Stack from "@mui/material/Stack";

import { useProjectsActions } from "../hooks";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsEmptyState } from "./ProjectsEmptyState";
import { useProjectsSelector } from "../context";
import { formatProjectDate } from "../utils";

export const ProjectsOverview = memo(() => {
  const projects = useProjectsSelector();
  const overviewProjects = useMemo(
    () =>
      projects.map((project) => ({
        project,
        promptsCount: project.tasks.length,
        createdLabel: formatProjectDate(project.created),
        updatedLabel: formatProjectDate(project.updated),
      })),
    [projects]
  );

  const {
    handleCreateProject,
    handleOpenProject,
    handleEditProject,
    handleDeleteProject,
  } = useProjectsActions();

  return (
    <Stack spacing={3} width="100%" data-testid="projects-overview">
      {projects.length === 0 ? (
        <ProjectsEmptyState onCreateProject={handleCreateProject} />
      ) : (
        <ProjectsGrid
          projects={overviewProjects}
          onOpen={handleOpenProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}
    </Stack>
  );
});

ProjectsOverview.displayName = "ProjectsOverview";
