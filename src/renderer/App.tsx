import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "@layouts/Main";
import { PublicRoute } from "@composites/PublicRoute";
import { PrivateRoute } from "@composites/PrivateRoute";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProviderAuth } from "@conceptions/Auth";
import { ProviderLightDarkMode } from "@composites/LightDarkMode";

const LazyHomeWindow = lazy(() => import("./windows/home/Home"));
const LazyUpdaterWindow = lazy(() => import("./windows/updater/Updater"));
const LazyLogInWindow = lazy(() => import("./windows/logIn/LogIn"));

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
                </Route>

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
