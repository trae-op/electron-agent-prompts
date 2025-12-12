import { memo } from "react";
import List from "@mui/material/List";

import { TaskListItem } from "./TaskListItem";
import type { TTaskListProps } from "./types";

export const TaskList = memo(
  ({ tasks, onOpen, onEdit, onDelete }: TTaskListProps) => {
    const sortedTasks = tasks
      .slice()
      .sort(
        (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
      );

    return (
      <List
        data-testid="tasks-list"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          alignSelf: "flex-start",
          boxShadow: (theme) => theme.shadows[1],
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          pt: 0,
          pb: 0,
        }}
      >
        {sortedTasks.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            divider={index < sortedTasks.length - 1}
          />
        ))}
      </List>
    );
  }
);

TaskList.displayName = "TaskList";
