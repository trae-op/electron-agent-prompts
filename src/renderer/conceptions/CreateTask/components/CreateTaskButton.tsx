import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { useCreateTaskModalActions } from "../hooks";
import { useParams } from "react-router-dom";

export const CreateTaskButton = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const { openModal } = useCreateTaskModalActions();

  if (projectId === undefined) {
    return null;
  }

  return (
    <Button
      variant="contained"
      startIcon={<AddRoundedIcon />}
      onClick={openModal}
      sx={{
        width: "100%",
        borderRadius: 0,
        px: 2.5,
        py: 1,
        fontWeight: 600,
        textTransform: "none",
        boxShadow: (theme) => theme.shadows[3],
      }}
      data-testid="create-task-button"
    >
      Create New Task
    </Button>
  );
};

CreateTaskButton.displayName = "CreateTaskButton";
