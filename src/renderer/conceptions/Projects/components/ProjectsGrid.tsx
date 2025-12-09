import { memo, useMemo } from "react";
import Grid from "@mui/material/Grid";

import { ProjectCard } from "./ProjectCard";
import type { TProjectsGridProps } from "./types";

export const ProjectsGrid = memo(
  ({ projects, onOpen, onEdit, onDelete }: TProjectsGridProps) => {
    const renderedProjects = useMemo(
      () =>
        projects.map((item) => (
          <Grid key={item.project.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <ProjectCard
              item={item}
              onOpen={onOpen}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid>
        )),
      [projects, onDelete, onEdit, onOpen]
    );

    return (
      <Grid container spacing={3} data-testid="projects-grid">
        {renderedProjects}
      </Grid>
    );
  }
);

ProjectsGrid.displayName = "ProjectsGrid";
