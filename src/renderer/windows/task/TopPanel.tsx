import { useCallback, type MouseEvent } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import TitleIcon from "@mui/icons-material/Title";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TransformIcon from "@mui/icons-material/Transform";
import PsychologyIcon from "@mui/icons-material/Psychology";

import { useTitleModalActions } from "@conceptions/Task/Title";
import { useCodeModalActions } from "@conceptions/Task/Code";
import { useListModalActions } from "@conceptions/Task/List";
import { useTextModalActions } from "@conceptions/Task/Text";
import { useArchitectureModalActions } from "@conceptions/Task/Architecture";
import { useConverterModalActions } from "@conceptions/Task/Converter";
import { useAgentSkillsModalActions } from "@conceptions/Task/AgentSkills";
import { TopPanel } from "@layouts/TopPanel";
import { SearchContent } from "@conceptions/Task/SearchContent";

const items = [
  { id: "1", action: "title", label: "title", icon: <TitleIcon /> },
  { id: "2", action: "text", label: "text", icon: <TextFieldsIcon /> },
  { id: "3", action: "list", label: "list", icon: <FormatListBulletedIcon /> },
  { id: "4", action: "code", label: "code", icon: <CodeIcon /> },
  {
    id: "5",
    action: "architecture",
    label: "architecture",
    icon: <AccountTreeIcon />,
  },
  { id: "6", action: "converter", label: "converter", icon: <TransformIcon /> },
  {
    id: "7",
    action: "agent-skills",
    label: "agent skills",
    icon: <PsychologyIcon />,
  },
];

const ContainerTopPanel = () => {
  const { openModal: openTitleModal } = useTitleModalActions();
  const { openModal: openCodeModal } = useCodeModalActions();
  const { openModal: openListModal } = useListModalActions();
  const { openModal: openTextModal } = useTextModalActions();
  const { openModal: openArchitectureModal } = useArchitectureModalActions();
  const { openModal: openConverterModal } = useConverterModalActions();
  const { openModal: openAgentSkillsModal } = useAgentSkillsModalActions();

  const handleOpenModal = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const button = target.closest("button");

      if (!button) {
        return;
      }

      switch (button.dataset.action) {
        case "title":
          openTitleModal();
          break;
        case "text":
          openTextModal();
          break;
        case "agent-skills":
          openAgentSkillsModal();
          break;
        case "architecture":
          openArchitectureModal();
          break;
        case "code":
          openCodeModal();
          break;
        case "list":
          openListModal();
          break;
        case "converter":
          openConverterModal();
          break;
        default:
          break;
      }
    },
    [
      openArchitectureModal,
      openAgentSkillsModal,
      openCodeModal,
      openConverterModal,
      openListModal,
      openTextModal,
      openTitleModal,
    ]
  );

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
        sx={{ flexGrow: 1 }}
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
      <SearchContent />
    </TopPanel>
  );
};

export default ContainerTopPanel;
