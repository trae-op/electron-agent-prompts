import { memo } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useProjectsSelector } from "@conceptions/Projects";
import { CreateProjectButton } from "@conceptions/CreateProject";

export const ProjectsHeader = memo(() => {
  const projects = useProjectsSelector();

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
      <CreateProjectButton />
    </Stack>
  );
});

ProjectsHeader.displayName = "ProjectsHeader";
