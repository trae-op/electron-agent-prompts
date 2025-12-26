import { lazy, memo, useCallback } from "react";
import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import {
  TaskList,
  useSetTasksDispatch,
  useTasksSelector,
} from "@conceptions/Tasks";
import { useSetDeleteTaskModalTaskDispatch } from "@conceptions/DeleteTask";

import { useSetUpdateTaskModalTaskDispatch } from "@conceptions/UpdateTask";
import { CreateTaskButton } from "@conceptions/CreateTask";

const SearchTasksLazy = lazy(async () => {
  const module = await import(
    "../../composites/SearchTasks/components/SearchTasks"
  );

  return { default: module.default };
});

export const TasksControl = () => {
  const tasks = useTasksSelector();
  const { projectId } = useParams<{ projectId?: string }>();
  const setTasks = useSetTasksDispatch();
  const handleSearchTasks = useCallback((searchedTasks: TTask[]) => {
    setTasks(searchedTasks);
  }, []);

  if (projectId === undefined) {
    return null;
  }

  return (
    <Stack direction="row" spacing={0.1} alignItems="center">
      <SearchTasksLazy items={tasks} handlerSearch={handleSearchTasks} />
      <CreateTaskButton />
    </Stack>
  );
};

export const TasksOverview = memo(() => {
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
      <TasksControl />

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
          onOpen={handleOpenTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </Stack>
    </Box>
  );
});

TasksOverview.displayName = "TasksOverview";
