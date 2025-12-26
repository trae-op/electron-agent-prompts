import { useCallback } from "react";
import {
  useAddNewProjectDispatch,
  useUpdateProjectDispatch,
  useRemoveProjectDispatch,
} from "@conceptions/Projects";
import { CreateProjectModal } from "@conceptions/CreateProject";
import { UpdateProjectModal } from "@conceptions/UpdateProject";
import { DeleteProjectModal } from "@conceptions/DeleteProject";

import {
  useAddNewTaskDispatch,
  useRemoveTaskDispatch,
  useSetTasksDispatch,
  useUpdateTaskDispatch,
} from "@conceptions/Tasks";
import { CreateTaskModal } from "@conceptions/CreateTask";
import { UpdateTaskModal } from "@conceptions/UpdateTask";
import { DeleteTaskModal } from "@conceptions/DeleteTask";

export const CreateProjectModalContainer = () => {
  const addNewProject = useAddNewProjectDispatch();

  const onSuccess = useCallback((data: TProject) => {
    addNewProject(data);
  }, []);

  return <CreateProjectModal onSuccess={onSuccess} />;
};

export const UpdateProjectModalContainer = () => {
  const updateProject = useUpdateProjectDispatch();

  const onSuccess = useCallback((data: TProject) => {
    updateProject(data);
  }, []);

  return <UpdateProjectModal onSuccess={onSuccess} />;
};

export const DeleteProjectModalContainer = () => {
  const removeProject = useRemoveProjectDispatch();
  const setTasks = useSetTasksDispatch();

  const onSuccess = useCallback(async (projectId: string) => {
    removeProject(projectId);
    setTasks([]);
  }, []);

  return <DeleteProjectModal onSuccess={onSuccess} />;
};

export const CreateTaskModalContainer = () => {
  const addNewTask = useAddNewTaskDispatch();

  const onSuccess = useCallback((data: TTaskWithFoldersContent) => {
    console.log("CreateTaskModalContainer onSuccess", data);
    addNewTask(data);
  }, []);

  return <CreateTaskModal onSuccess={onSuccess} />;
};

export const UpdateTaskModalContainer = () => {
  const updateTask = useUpdateTaskDispatch();

  const onSuccess = useCallback((data: TTaskWithFoldersContent) => {
    console.log("UpdateTaskModalContainer onSuccess", data);
    updateTask(data);
  }, []);

  return <UpdateTaskModal onSuccess={onSuccess} />;
};

export const DeleteTaskModalContainer = () => {
  const removeTask = useRemoveTaskDispatch();

  const onSuccess = useCallback((taskId: number) => {
    removeTask(taskId);
  }, []);

  return <DeleteTaskModal onSuccess={onSuccess} />;
};
