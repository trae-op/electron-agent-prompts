import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";

import { ProjectList } from "@conceptions/Projects/components/ProjectList";
import { useProjectsSelector } from "@conceptions/Projects/context";
import Typography from "@mui/material/Typography";
import { useUpdateProjectModalActions } from "@conceptions/UpdateProject";
import { useDeleteProjectModalActions } from "@conceptions/DeleteProject";
import { CreateProjectButton } from "@conceptions/CreateProject";
import Box from "@mui/material/Box";

const ProjectsOverview = memo(() => {
  const navigate = useNavigate();

  const projects = useProjectsSelector();
  const { openModal: openUpdateProjectModal } = useUpdateProjectModalActions();
  const { openModal: openDeleteProjectModal } = useDeleteProjectModalActions();

  const handleEditProject = useCallback(
    (project: TProject) => {
      openUpdateProjectModal(project);
    },
    [openUpdateProjectModal]
  );

  const handleOpenProject = useCallback(
    async (project: TProject) => {
      await navigate(`/window:main/${project.id}`);
      window.electron.send.tasks({ projectId: Number(project.id) });
    },
    [navigate]
  );

  const handleDeleteProject = useCallback(
    (project: TProject) => {
      openDeleteProjectModal(project);
    },
    [openDeleteProjectModal]
  );

  return (
    <Box width={500}>
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

export default ProjectsOverview;
