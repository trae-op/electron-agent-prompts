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
  Provider as ProviderUpdater,
  UpdateSubscriber,
} from "@conceptions/Updater";
import { ProjectsHeader } from "./ProjectsHeader";
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

const Home = () => {
  return (
    <ProviderUpdater>
      <UpdateSubscriber />
      <ProviderUser>
        <ProviderCreateProject>
          <ProviderProjects>
            <ProjectsSubscriber />
            <ProviderUpdateProject>
              <Suspense fallback={<LoadingSpinner />}>
                <LazyTopPanel />
              </Suspense>
              <Stack
                sx={{
                  mt: 6,
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
                  <ProjectsHeader />
                  <CreateProjectModalContainer />
                  <UpdateProjectModalContainer />
                </Box>

                <Box
                  overflow="auto"
                  sx={{
                    pl: 2,
                    pr: 2,
                    pb: 1,
                    pt: 1,
                    width: "100%",
                    height: "calc(100vh - 140px)",
                    "&::-webkit-scrollbar": {
                      width: 0,
                    },
                  }}
                >
                  <ProjectsOverview />
                </Box>
              </Stack>
            </ProviderUpdateProject>
          </ProviderProjects>
        </ProviderCreateProject>
      </ProviderUser>
    </ProviderUpdater>
  );
};

export default Home;
