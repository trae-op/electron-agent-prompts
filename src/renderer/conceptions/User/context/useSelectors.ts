import { ReactElement, useSyncExternalStore } from "react";

import { useEntityContext, usePopoverEntityContext } from "./useContext";

export function useUserSelector(): TUser | undefined {
  const { getUser, subscribe } = useEntityContext();
  return useSyncExternalStore(subscribe, getUser, getUser);
}

export const useSetUserDispatch = () => {
  return useEntityContext().setUser;
};

export function useNewVersionAppSelector(): boolean | undefined {
  const { getNewVersionApp, subscribe } = usePopoverEntityContext();
  return useSyncExternalStore(subscribe, getNewVersionApp, getNewVersionApp);
}

export function useRenderButtonLogoutSelector(): ReactElement | null {
  const { getRenderButtonLogout, subscribe } = usePopoverEntityContext();
  return useSyncExternalStore(
    subscribe,
    getRenderButtonLogout,
    getRenderButtonLogout
  );
}

export function useRenderButtonUpdateSelector(): ReactElement | null {
  const { getRenderButtonUpdateApp, subscribe } = usePopoverEntityContext();
  return useSyncExternalStore(
    subscribe,
    getRenderButtonUpdateApp,
    getRenderButtonUpdateApp
  );
}
