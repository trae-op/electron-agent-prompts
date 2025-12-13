import { memo, useCallback } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { TaskList, useTasksSelector } from "@conceptions/Tasks";
import { useUpdateTaskModalActions } from "@conceptions/UpdateTask";
import { useDeleteTaskModalActions } from "@conceptions/DeleteTask";
import { CreateTaskButton } from "@conceptions/CreateTask";

export const TasksOverview = memo(() => {
  const tasks = useTasksSelector();
  const { openModal: openUpdateTaskModal } = useUpdateTaskModalActions();
  const { openModal: openDeleteTaskModal } = useDeleteTaskModalActions();

  const handleEditTask = useCallback(
    (task: TTask) => {
      openUpdateTaskModal(task);
    },
    [openUpdateTaskModal]
  );

  const handleOpenTask = useCallback((task: TTask) => {
    console.info("Open task", task.id);
  }, []);

  const handleDeleteTask = useCallback(
    (task: TTask) => {
      openDeleteTaskModal(task);
    },
    [openDeleteTaskModal]
  );

  return (
    <Box width={"100%"}>
      <CreateTaskButton />
      <Stack
        height="calc(100vh - 95px)"
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
        data-testid="tasks-overview"
      >
        <TaskList
          tasks={tasks}
          onOpen={handleOpenTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </Stack>
    </Box>
  );
});

TasksOverview.displayName = "TasksOverview";
