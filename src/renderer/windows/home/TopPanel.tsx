import { memo } from "react";
import Stack from "@mui/material/Stack";
import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";
import { grey } from "@mui/material/colors";
import { UserPopover, PopoverProvider } from "@conceptions/User";
import { LogoutButton } from "@conceptions/Auth";
import { useStatusSelector, DownloadedButton } from "@conceptions/Updater";
import { TopPanel } from "@layouts/TopPanel";
import { Container as ContainerAppVersion } from "@composites/AppVersion";

const ContainerPopover = memo(() => {
  const status = useStatusSelector();

  return (
    <PopoverProvider
      isNewVersionApp={status === "update-downloaded"}
      renderButtonLogout={
        <LogoutButton<ListItemButtonProps> component={ListItemButton}>
          Logout
        </LogoutButton>
      }
      renderButtonUpdateApp={
        <DownloadedButton<ListItemButtonProps> component={ListItemButton}>
          Update
        </DownloadedButton>
      }
    >
      <UserPopover />
    </PopoverProvider>
  );
});

const ContainerTopPanel = () => {
  return (
    <TopPanel
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        paddingTop: 0.5,
        paddingBottom: 0.5,
        paddingRight: 1,
        paddingLeft: 1,
        backgroundColor: grey[900],
      }}
    >
      <ContainerAppVersion sx={{ width: "100%" }} variant="caption" />
      <Stack
        spacing={1}
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <ContainerPopover />
      </Stack>
    </TopPanel>
  );
};

export default ContainerTopPanel;
