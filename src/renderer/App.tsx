import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "@layouts/Main";
import { PrivateRoute, PublicRoute } from "@composites/Routes";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProviderAuth } from "@conceptions/Auth";
import { ProviderLightDarkMode } from "@composites/LightDarkMode";

const LazyHomeWindow = lazy(() => import("./windows/home/Home"));
const LazyUpdaterWindow = lazy(() => import("./windows/updater/Updater"));
const LazyLogInWindow = lazy(() => import("./windows/logIn/LogIn"));
const LazyTaskWindow = lazy(() => import("./windows/task/Task"));

export const App = () => {
  return (
    <ProviderAuth>
      <ProviderLightDarkMode>
        <HashRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route element={<PublicRoute />}>
                  <Route path="/sign-in" element={<LazyLogInWindow />} />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/window:main" element={<LazyHomeWindow />} />
                  <Route
                    path="/window:main/:projectId"
                    element={<LazyHomeWindow />}
                  />
                </Route>
                <Route path="/window:task/:id" element={<LazyTaskWindow />} />
                <Route
                  path="/window:update-app"
                  element={<LazyUpdaterWindow />}
                />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      </ProviderLightDarkMode>
    </ProviderAuth>
  );
};
