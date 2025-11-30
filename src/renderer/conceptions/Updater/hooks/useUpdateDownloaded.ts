import { useCallback, useMemo } from "react";
import type { THookUpdateDownloaded } from "./types";
import {
  usePlatformSelector,
  useUpdateFileSelector,
} from "../context/useSelectors";

export const useUpdateDownloaded = (): THookUpdateDownloaded => {
  const platform = usePlatformSelector();
  const updateFile = useUpdateFileSelector();

  const handleUpdate = useCallback(() => {
    if (platform === "win32") {
      window.electron.send.restart();
    }

    if (platform !== "win32" && updateFile !== undefined) {
      window.electron.send.openLatestVersion({
        updateFile,
      });
    }
  }, [platform, updateFile]);

  return useMemo(() => ({ handleUpdate }), [handleUpdate]);
};
