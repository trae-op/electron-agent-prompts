import { memo } from "react";
import List from "@mui/material/List";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { TaskListItem } from "./TaskListItem";
import type { TTaskListProps } from "./types";
import ListItem from "@mui/material/ListItem";

export const TaskList = memo(
  ({ tasks, onOpen, onEdit, onDelete }: TTaskListProps) => {
    const sortedTasks = tasks
      .slice()
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );

    return (
      <List
        data-testid="tasks-list"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          alignSelf: "flex-start",
          pt: 0,
          pb: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {sortedTasks.length === 0 ? (
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
          sortedTasks.map((task, index) => (
            <TaskListItem
              key={task.id}
              task={task}
              onOpen={onOpen}
              onEdit={onEdit}
              onDelete={onDelete}
              divider={index < sortedTasks.length - 1}
            />
          ))
        )}
      </List>
    );
  }
);

TaskList.displayName = "TaskList";
