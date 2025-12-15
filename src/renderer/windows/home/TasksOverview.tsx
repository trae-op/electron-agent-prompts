import { memo, useCallback } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { TaskList, useTasksSelector } from "@conceptions/Tasks";
import { useSetDeleteTaskModalTaskDispatch } from "@conceptions/DeleteTask";

import { useSetUpdateTaskModalTaskDispatch } from "@conceptions/UpdateTask";
import { CreateTaskButton } from "@conceptions/CreateTask";

export const TasksOverview = memo(() => {
  const tasks = useTasksSelector();
  const setDeleteTask = useSetDeleteTaskModalTaskDispatch();
  const setUpdateTask = useSetUpdateTaskModalTaskDispatch();

  const handleEditTask = useCallback((task: TTask) => {
    setUpdateTask(task);
  }, []);

  const handleOpenTask = useCallback((task: TTask) => {
    window.electron.send.windowTask({ id: task.id + "" });
  }, []);

  const handleDeleteTask = useCallback((task: TTask) => {
    setDeleteTask(task);
  }, []);

  return (
    <Box width="100%">
      <CreateTaskButton />
      <Stack
        height="calc(100vh - 88px)"
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
