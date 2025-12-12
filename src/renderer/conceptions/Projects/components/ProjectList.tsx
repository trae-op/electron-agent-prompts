import { memo } from "react";
import List from "@mui/material/List";

import { ProjectListItem } from "./ProjectListItem";
import type { TProjectListProps } from "./types";

export const ProjectList = memo(
  ({ projects, onOpen, onEdit, onDelete }: TProjectListProps) => {
    const sortedProjects = projects
      .slice()
      .sort(
        (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
      );

    return (
      <List
        data-testid="projects-list"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          alignSelf: "flex-start",
          boxShadow: (theme) => theme.shadows[1],
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          pt: 0,
          pb: 0,
        }}
      >
        {sortedProjects.map((project, index) => (
          <ProjectListItem
            key={project.id}
            project={project}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            divider={index < sortedProjects.length - 1}
          />
        ))}
      </List>
    );
  }
);

ProjectList.displayName = "ProjectList";
