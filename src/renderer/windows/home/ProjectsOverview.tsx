import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { useProjectsSelector, ProjectList } from "@conceptions/Projects";
import { useSetDeleteProjectModalProjectDispatch } from "@conceptions/DeleteProject";
import { useSetUpdateProjectModalProjectDispatch } from "@conceptions/UpdateProject";
import { CreateProjectButton } from "@conceptions/CreateProject";
import Box from "@mui/material/Box";

const ProjectsOverview = memo(() => {
  const navigate = useNavigate();
  const projects = useProjectsSelector();
  const setUpdateProject = useSetUpdateProjectModalProjectDispatch();
  const setDeleteProject = useSetDeleteProjectModalProjectDispatch();

  const handleEditProject = useCallback((project: TProject) => {
    setUpdateProject(project);
  }, []);

  const handleOpenProject = useCallback(
    async (project: TProject) => {
      await navigate(`/window:main/${project.id}`);
      window.electron.send.tasks({ projectId: Number(project.id) });
    },
    [navigate]
  );

  const handleDeleteProject = useCallback((project: TProject) => {
    setDeleteProject(project);
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
