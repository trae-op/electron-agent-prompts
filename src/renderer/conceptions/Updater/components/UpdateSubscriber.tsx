import { useEffect, useCallback } from "react";
import {
  useSetDownloadedPercentDispatch,
  useSetMessageDispatch,
  useSetPlatformDispatch,
  useSetStatusDispatch,
  useSetUpdateFileDispatch,
  useSetVersionDispatch,
} from "../context/useSelectors";

export const UpdateSubscriber = () => {
  const setDownloadedPercent = useSetDownloadedPercentDispatch();
  const setMessage = useSetMessageDispatch();
  const setVersion = useSetVersionDispatch();
  const setPlatform = useSetPlatformDispatch();
  const setUpdateFile = useSetUpdateFileDispatch();
  const setStatus = useSetStatusDispatch();

  const subscribeUpdateApp = useCallback(() => {
    return window.electron.receive.subscribeUpdateApp(
      ({
        downloadedPercent,
        message,
        version,
        platform,
        updateFile,
        status,
      }) => {
        setDownloadedPercent(downloadedPercent);
        setMessage(message);
        setVersion(version);
        setPlatform(platform);
        setUpdateFile(updateFile);
        setStatus(status);
      }
    );
  }, []);

  useEffect(() => {
    window.electron.send.checkForUpdates();
  }, []);

  useEffect(() => {
    const unSub = subscribeUpdateApp();

    return unSub;
  }, []);

  return null;
};
