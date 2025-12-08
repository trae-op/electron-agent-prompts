import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import type { TProjectsEmptyStateProps } from "./types";

export const ProjectsEmptyState = ({
  onCreateProject,
}: TProjectsEmptyStateProps) => {
  return (
    <Box
      data-testid="projects-empty-state"
      sx={{
        borderRadius: 3,
        border: (theme) =>
          `1px dashed ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[700]
              : theme.palette.grey[300]
          }`,
        py: 6,
        px: 4,
        textAlign: "center",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : theme.palette.background.default,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        You do not have any projects yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create your first project to start organizing and managing agent
        prompts.
      </Typography>
      <Button
        variant="contained"
        onClick={onCreateProject}
        data-testid="projects-empty-action"
        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
      >
        Create a Project
      </Button>
    </Box>
  );
};
