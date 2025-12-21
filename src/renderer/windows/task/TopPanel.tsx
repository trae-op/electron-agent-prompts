import { useCallback, type MouseEvent } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import TitleIcon from "@mui/icons-material/Title";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import { useTitleModalActions } from "@conceptions/Task/Title";
import { TopPanel } from "@layouts/TopPanel";

const items = [
  { id: "1", action: "title", label: "title", icon: <TitleIcon /> },
  { id: "2", action: "list", label: "list", icon: <FormatListBulletedIcon /> },
  { id: "3", action: "code", label: "code", icon: <CodeIcon /> },
];

const ContainerTopPanel = () => {
  const { openModal } = useTitleModalActions();

  const handleOpenModal = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const button = target.closest("button");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    if (action === "title") {
      openModal();
    }

    if (action === "code" || action === "list") {
      console.log(`Action: ${action}`);
    }
  }, []);

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
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[100],
        borderBottom: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[200]
          }`,
      }}
    >
      <Stack
        spacing={1}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ width: "100%" }}
        onClick={handleOpenModal}
      >
        {items.map((item) => (
          <IconButton
            key={item.id}
            data-action={item.action}
            aria-label={item.label}
          >
            {item.icon}
          </IconButton>
        ))}
      </Stack>
    </TopPanel>
  );
};

export default ContainerTopPanel;
