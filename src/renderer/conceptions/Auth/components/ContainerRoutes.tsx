import { memo, useEffect, type ReactNode } from "react";
import { Provider } from "../context";
import { useSetAuthenticatedDispatch } from "../context/useSelectors";

const ContainerIpc = memo(({ children }: { children: ReactNode }) => {
  const setAuthenticated = useSetAuthenticatedDispatch();

  useEffect(() => {
    window.electron.send.checkAuth();
  }, []);

  useEffect(() => {
    window.electron.receive.subscribeWindowAuth(({ isAuthenticated }) => {
      setAuthenticated(isAuthenticated);
    });
  }, []);

  return children;
});

export const ProviderAuth = memo(({ children }: { children: ReactNode }) => (
  <Provider>
    <ContainerIpc>{children}</ContainerIpc>
  </Provider>
));
