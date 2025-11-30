import Stack from "@mui/material/Stack";
import Button, { ButtonProps } from "@mui/material/Button";
import { Circular } from "./CircularProgress";
import { DownloadedButton } from "./DownloadedButton";
import { Message } from "./Message";
import { useEffect, type PropsWithChildren } from "react";
import {
  useSetDownloadedPercentDispatch,
  useSetMessageDispatch,
  useSetPlatformDispatch,
  useSetStatusDispatch,
  useSetUpdateFileDispatch,
  useSetVersionDispatch,
} from "../context/useSelectors";

const Container = ({ children }: PropsWithChildren) => {
  const setDownloadedPercent = useSetDownloadedPercentDispatch();
  const setMessage = useSetMessageDispatch();
  const setVersion = useSetVersionDispatch();
  const setPlatform = useSetPlatformDispatch();
  const setUpdateFile = useSetUpdateFileDispatch();
  const setStatus = useSetStatusDispatch();

  useEffect(() => {
    const unSub = window.electron.receive.subscribeUpdateApp(
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

    return unSub;
  }, []);

  return <>{children}</>;
};

export const Window = () => {
  return (
    <Container>
      <Stack spacing={2} alignItems="center">
        <Message />
        <Circular />
        <DownloadedButton<ButtonProps> component={Button} variant="outlined">
          Update downloaded
        </DownloadedButton>
      </Stack>
    </Container>
  );
};
