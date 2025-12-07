import Stack from "@mui/material/Stack";
import Button, { ButtonProps } from "@mui/material/Button";
import { Circular } from "./CircularProgress";
import { DownloadedButton } from "./DownloadedButton";
import { Message } from "./Message";
import { UpdateSubscriber } from "./UpdateSubscriber";

export const Window = () => {
  return (
    <Stack spacing={2} alignItems="center">
      <UpdateSubscriber />
      <Message />
      <Circular />
      <DownloadedButton<ButtonProps> component={Button} variant="outlined">
        Update downloaded
      </DownloadedButton>
    </Stack>
  );
};
