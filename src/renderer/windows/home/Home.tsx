import { lazy, Suspense } from "react";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Provider as ProviderUser } from "@conceptions/User";
import { Provider as ProviderProjects } from "@conceptions/Projects";
import { Provider as ProviderCreateProject } from "@conceptions/CreateProject";
import { Provider as ProviderUpdateProject } from "@conceptions/UpdateProject";
import { Provider as ProviderDeleteProject } from "@conceptions/DeleteProject";
import {
  Provider as ProviderUpdater,
  UpdateSubscriber,
} from "@conceptions/Updater";

import { useClosePreloadWindow } from "@hooks/closePreloadWindow";
import { Provider as ProviderUpdateTask } from "@conceptions/UpdateTask";
import { Provider as ProviderDeleteTask } from "@conceptions/DeleteTask";
import { Provider as ProviderCreateTask } from "@conceptions/CreateTask";
import { Provider as ProviderTasks } from "@conceptions/Tasks";
import { Subscriber } from "./Subscriber";
import {
  CreateProjectModalContainer,
  CreateTaskModalContainer,
  DeleteProjectModalContainer,
  DeleteTaskModalContainer,
  UpdateProjectModalContainer,
  UpdateTaskModalContainer,
} from "./InitModals";

const LazyTopPanel = lazy(() => import("./TopPanel"));
const LazyTasksContent = lazy(() => import("./TasksContent"));
const LazyProjectsOverview = lazy(() => import("./ProjectsOverview"));

const Home = () => {
  useClosePreloadWindow();

  return (
    <ProviderUpdater>
      <UpdateSubscriber />

      <ProviderCreateProject>
        <ProviderProjects>
          <ProviderTasks>
            <Subscriber />

            <ProviderUpdateProject>
              <ProviderDeleteProject>
                <ProviderCreateTask>
                  <ProviderUpdateTask>
                    <ProviderDeleteTask>
                      <CreateProjectModalContainer />
                      <UpdateProjectModalContainer />
                      <DeleteProjectModalContainer />
                      <CreateTaskModalContainer />
                      <UpdateTaskModalContainer />
                      <DeleteTaskModalContainer />

                      <ProviderUser>
                        <Suspense fallback={<LoadingSpinner />}>
                          <LazyTopPanel />
                        </Suspense>
                      </ProviderUser>
                      <Stack
                        sx={{
                          mt: 6,
                          width: "100%",
                        }}
                        direction="column"
                        spacing={1}
                      >
                        <Stack direction="row" alignItems="center">
                          <Suspense fallback={<LoadingSpinner />}>
                            <LazyProjectsOverview />
                          </Suspense>
                          <Suspense fallback={<LoadingSpinner />}>
                            <LazyTasksContent />
                          </Suspense>
                        </Stack>
                      </Stack>
                    </ProviderDeleteTask>
                  </ProviderUpdateTask>
                </ProviderCreateTask>
              </ProviderDeleteProject>
            </ProviderUpdateProject>
          </ProviderTasks>
        </ProviderProjects>
      </ProviderCreateProject>
    </ProviderUpdater>
  );
};

export default Home;
