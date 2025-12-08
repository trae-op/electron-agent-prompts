import { lazy, Suspense } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Provider as ProviderUser } from "@conceptions/User";
import {
  Provider as ProviderProjects,
  ProjectsOverview,
  ProjectsHeader,
} from "@conceptions/Projects";
import {
  Provider as ProviderUpdater,
  UpdateSubscriber,
} from "@conceptions/Updater";

const LazyTopPanel = lazy(() => import("./TopPanel"));

const Home = () => {
  return (
    <ProviderUpdater>
      <UpdateSubscriber />
      <ProviderUser>
        <ProviderProjects>
          <Suspense fallback={<LoadingSpinner />}>
            <LazyTopPanel />
          </Suspense>
          <Stack
            sx={{
              mt: 6,
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
        </ProviderProjects>
      </ProviderUser>
    </ProviderUpdater>
  );
};

export default Home;
