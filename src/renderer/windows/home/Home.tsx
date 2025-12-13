import { lazy, Suspense, useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Provider as ProviderUser } from "@conceptions/User";
import {
  Provider as ProviderProjects,
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
import { Provider as ProviderTasks } from "@conceptions/Tasks";
import { Subscriber } from "./Subscriber";

const LazyTopPanel = lazy(() => import("./TopPanel"));
const LazyTasksContent = lazy(() => import("./TasksContent"));
const LazyProjectsOverview = lazy(() => import("./ProjectsOverview"));

const CreateProjectModalContainer = () => {
  const addNewProject = useAddNewProjectDispatch();

  const onSuccess = useCallback(
    (data: TProject) => {
      addNewProject(data);
    },
    [addNewProject]
  );

  return <CreateProjectModal onSuccess={onSuccess} />;
};

const UpdateProjectModalContainer = () => {
  const updateProject = useUpdateProjectDispatch();

  const onSuccess = useCallback(
    (data: TProject) => {
      updateProject(data);
    },
    [updateProject]
  );

  return <UpdateProjectModal onSuccess={onSuccess} />;
};

const DeleteProjectModalContainer = () => {
  const removeProject = useRemoveProjectDispatch();

  const onSuccess = useCallback(
    (projectId: string) => {
      removeProject(projectId);
    },
    [removeProject]
  );

  return <DeleteProjectModal onSuccess={onSuccess} />;
};

const Home = () => {
  return (
    <ProviderUpdater>
      <UpdateSubscriber />

      <ProviderCreateProject>
        <ProviderProjects>
          <ProviderTasks>
            <Subscriber />
          </ProviderTasks>
          <ProviderUpdateProject>
            <ProviderDeleteProject>
              <ProviderUser>
                <Suspense fallback={<LoadingSpinner />}>
                  <LazyTopPanel />
                </Suspense>
              </ProviderUser>
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

                <Stack direction="row" alignItems="center" spacing={0.2}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyProjectsOverview />
                  </Suspense>
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyTasksContent />
                  </Suspense>
                </Stack>
              </Stack>
            </ProviderDeleteProject>
          </ProviderUpdateProject>
        </ProviderProjects>
      </ProviderCreateProject>
    </ProviderUpdater>
  );
};

export default Home;
