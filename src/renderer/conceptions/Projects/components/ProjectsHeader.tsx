import { memo } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { useProjectsSelector } from "../context";
import { useProjectsActions } from "../hooks";

export const ProjectsHeader = memo(() => {
  const projects = useProjectsSelector();
  const { handleCreateProject } = useProjectsActions();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2}
      data-testid="projects-header"
    >
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={600} data-testid="projects-title">
          My Projects
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Manage your agent prompt projects - ${projects.length}`}
        </Typography>
      </Stack>
      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={handleCreateProject}
        sx={{
          borderRadius: 2,
          px: 2.5,
          py: 1,
          fontWeight: 600,
          textTransform: "none",
          boxShadow: (theme) => theme.shadows[3],
        }}
        data-testid="create-project-button"
      >
        Create New Project
      </Button>
    </Stack>
  );
});

ProjectsHeader.displayName = "ProjectsHeader";
