import { useEffect } from "react";

export const useClosePreloadWindow = () => {
  useEffect(() => {
    window.electron.send.windowClosePreload();
  }, []);
};
