import { lazy, Suspense } from "react";
import Box from "@mui/material/Box";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Provider as ProviderUser } from "@conceptions/User";
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
        <Suspense fallback={<LoadingSpinner />}>
          <LazyTopPanel />
        </Suspense>
        <Box sx={{ mt: 6, width: "100%" }}>
          <Suspense fallback={<LoadingSpinner />}>Home</Suspense>
        </Box>
      </ProviderUser>
    </ProviderUpdater>
  );
};

export default Home;
