import { useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  Provider as ProviderTasks,
  useAddNewTaskDispatch,
  useUpdateTaskDispatch,
  useRemoveTaskDispatch,
} from "@conceptions/Tasks";
import {
  Provider as ProviderCreateTask,
  CreateTaskModal,
} from "@conceptions/CreateTask";
import {
  Provider as ProviderUpdateTask,
  UpdateTaskModal,
} from "@conceptions/UpdateTask";
import {
  Provider as ProviderDeleteTask,
  DeleteTaskModal,
} from "@conceptions/DeleteTask";
import { TasksOverview } from "./TasksOverview";

const CreateTaskModalContainer = () => {
  const addNewTask = useAddNewTaskDispatch();

  const onSuccess = useCallback((data: TTask) => {
    addNewTask(data);
  }, []);

  return <CreateTaskModal onSuccess={onSuccess} />;
};

const UpdateTaskModalContainer = () => {
  const updateTask = useUpdateTaskDispatch();

  const onSuccess = useCallback(
    (data: TTask) => {
      updateTask(data);
    },
    [updateTask]
  );

  return <UpdateTaskModal onSuccess={onSuccess} />;
};

const DeleteTaskModalContainer = () => {
  const removeTask = useRemoveTaskDispatch();

  const onSuccess = useCallback(
    (taskId: number) => {
      removeTask(taskId);
    },
    [removeTask]
  );

  return <DeleteTaskModal onSuccess={onSuccess} />;
};

const TasksContent = () => {
  return (
    <ProviderTasks>
      <ProviderCreateTask>
        <ProviderUpdateTask>
          <ProviderDeleteTask>
            <Stack width="100%">
              <Box
                sx={{
                  pl: 2,
                  pr: 2,
                }}
              >
                <CreateTaskModalContainer />
                <UpdateTaskModalContainer />
                <DeleteTaskModalContainer />
              </Box>

              <TasksOverview />
            </Stack>
          </ProviderDeleteTask>
        </ProviderUpdateTask>
      </ProviderCreateTask>
    </ProviderTasks>
  );
};

export default TasksContent;
