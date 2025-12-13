import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { useProjectsSelector, ProjectList } from "@conceptions/Projects";
import { useUpdateProjectModalActions } from "@conceptions/UpdateProject";
import { useDeleteProjectModalActions } from "@conceptions/DeleteProject";
import { CreateProjectButton } from "@conceptions/CreateProject";
import Box from "@mui/material/Box";

const ProjectsOverview = memo(() => {
  const navigate = useNavigate();
  const projects = useProjectsSelector();
  const { openModal: openUpdateProjectModal } = useUpdateProjectModalActions();
  const { openModal: openDeleteProjectModal } = useDeleteProjectModalActions();

  const handleEditProject = useCallback((project: TProject) => {
    openUpdateProjectModal(project);
  }, []);

  const handleOpenProject = useCallback(
    async (project: TProject) => {
      await navigate(`/window:main/${project.id}`);
      window.electron.send.tasks({ projectId: Number(project.id) });
    },
    [navigate]
  );

  const handleDeleteProject = useCallback((project: TProject) => {
    openDeleteProjectModal(project);
  }, []);

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
        <ProjectList
          projects={projects}
          onOpen={handleOpenProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      </Stack>
    </Box>
  );
});

export default ProjectsOverview;
