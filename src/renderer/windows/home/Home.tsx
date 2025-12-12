import { lazy, Suspense, useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Provider as ProviderUser } from "@conceptions/User";
import {
  Provider as ProviderProjects,
  ProjectsSubscriber,
  useAddNewProjectDispatch,
  useUpdateProjectDispatch,
  useRemoveProjectDispatch,
} from "@conceptions/Projects";
import {
  Provider as ProviderCreateProject,
  CreateProjectModal,
} from "@conceptions/CreateProject";
import {
  Provider as ProviderUpdateProject,
  UpdateProjectModal,
} from "@conceptions/UpdateProject";
import {
  Provider as ProviderDeleteProject,
  DeleteProjectModal,
} from "@conceptions/DeleteProject";
import {
  Provider as ProviderUpdater,
  UpdateSubscriber,
} from "@conceptions/Updater";
import { ProjectsOverview } from "./ProjectsOverview";

const LazyTopPanel = lazy(() => import("./TopPanel"));

const CreateProjectModalContainer = () => {
  const addNewProject = useAddNewProjectDispatch();

  const onSuccess = useCallback((data: TProject) => {
    addNewProject(data);
  }, []);

  return <CreateProjectModal onSuccess={onSuccess} />;
};

const UpdateProjectModalContainer = () => {
  const updateProject = useUpdateProjectDispatch();

  const onSuccess = useCallback((data: TProject) => {
    updateProject(data);
  }, []);

  return <UpdateProjectModal onSuccess={onSuccess} />;
};

const DeleteProjectModalContainer = () => {
  const removeProject = useRemoveProjectDispatch();

  const onSuccess = useCallback((projectId: string) => {
    removeProject(projectId);
  }, []);

  return <DeleteProjectModal onSuccess={onSuccess} />;
};

const Home = () => {
  return (
    <ProviderUpdater>
      <UpdateSubscriber />
      <ProviderUser>
        <ProviderCreateProject>
          <ProviderProjects>
            <ProjectsSubscriber />
            <ProviderUpdateProject>
              <ProviderDeleteProject>
                <Suspense fallback={<LoadingSpinner />}>
                  <LazyTopPanel />
                </Suspense>
                <Stack
                  sx={{
                    mt: 4,
                    width: "100%",
                  }}
                  direction="column"
                  spacing={1}
                >
                  <Box
                    sx={{
                      pl: 2,
                      pr: 2,
                    }}
                  >
                    <CreateProjectModalContainer />
                    <UpdateProjectModalContainer />
                    <DeleteProjectModalContainer />
                  </Box>

                  <ProjectsOverview />
                </Stack>
              </ProviderDeleteProject>
            </ProviderUpdateProject>
          </ProviderProjects>
        </ProviderCreateProject>
      </ProviderUser>
    </ProviderUpdater>
  );
};

export default Home;
