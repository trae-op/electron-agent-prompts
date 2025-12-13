import { memo } from "react";
import List from "@mui/material/List";

import { ProjectListItem } from "./ProjectListItem";
import type { TProjectListProps } from "./types";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import ListItem from "@mui/material/ListItem";

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
          width: "100%",
          height: "100%",
        }}
      >
        {sortedProjects.length === 0 ? (
          <ListItem
            disablePadding
            sx={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <SentimentDissatisfiedIcon
              sx={{
                fontSize: 80,
              }}
            />
          </ListItem>
        ) : (
          sortedProjects.map((project, index) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onOpen={onOpen}
              onEdit={onEdit}
              onDelete={onDelete}
              divider={index < sortedProjects.length - 1}
            />
          ))
        )}
      </List>
    );
  }
);

ProjectList.displayName = "ProjectList";
