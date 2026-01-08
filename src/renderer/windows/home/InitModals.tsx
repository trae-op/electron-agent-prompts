import { useCallback, useEffect, useState } from "react";
import {
  useAddNewProjectDispatch,
  useProjectsSelector,
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
  useTasksSelector,
} from "@conceptions/Tasks";
import { CreateTaskModal } from "@conceptions/CreateTask";
import {
  UpdateTaskModal,
  useUpdateTaskModalTaskSelector,
} from "@conceptions/UpdateTask";
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
  const projects = useProjectsSelector();
  const tasks = useTasksSelector();
  const updateProject = useUpdateProjectDispatch();
  const [taskId, setTaskId] = useState<number | undefined>(undefined);

  const onSuccess = useCallback((data: TTaskWithFoldersContent) => {
    addNewTask(data);
    setTaskId(data.id);
  }, []);

  const updateProjectCount = useCallback(
    (taskId: number | undefined) => {
      const foundCurrentTask = tasks.find((task) => task.id === taskId);

      const foundCurrentProject = foundCurrentTask
        ? projects.find(
            (project) =>
              String(project.id) === String(foundCurrentTask.projectId)
          )
        : undefined;

      if (foundCurrentProject !== undefined) {
        updateProject({
          ...foundCurrentProject,
          countTasks: Math.max(0, foundCurrentProject.countTasks + 1),
        });
      }
    },
    [tasks, projects]
  );

  useEffect(() => {
    updateProjectCount(taskId);
  }, [taskId]);

  return <CreateTaskModal onSuccess={onSuccess} />;
};

export const UpdateTaskModalContainer = () => {
  const projects = useProjectsSelector();
  const updateTask = useUpdateTaskDispatch();
  const task = useUpdateTaskModalTaskSelector();
  const removeTask = useRemoveTaskDispatch();
  const updateProject = useUpdateProjectDispatch();

  const onSuccess = useCallback(
    (data: TTaskWithFoldersContent) => {
      if (task !== undefined && task.projectId !== data.projectId) {
        const foundCurrentProject = projects.find(
          (project) => String(project.id) === String(task.projectId)
        );
        const foundMoveProject = projects.find(
          (project) => String(project.id) === String(data.projectId)
        );

        if (foundCurrentProject !== undefined) {
          updateProject({
            ...foundCurrentProject,
            countTasks: Math.max(0, foundCurrentProject.countTasks - 1),
          });
        }

        if (foundMoveProject !== undefined) {
          updateProject({
            ...foundMoveProject,
            countTasks: Math.max(0, foundMoveProject.countTasks + 1),
          });
        }

        removeTask(data.id);

        return;
      }

      updateTask(data);
    },
    [task]
  );

  return <UpdateTaskModal onSuccess={onSuccess} projects={projects} />;
};

export const DeleteTaskModalContainer = () => {
  const removeTask = useRemoveTaskDispatch();
  const projects = useProjectsSelector();
  const tasks = useTasksSelector();
  const updateProject = useUpdateProjectDispatch();

  const onSuccess = useCallback(
    (taskId: number) => {
      const foundCurrentTask = tasks.find((task) => task.id === taskId);

      const foundCurrentProject = foundCurrentTask
        ? projects.find(
            (project) =>
              String(project.id) === String(foundCurrentTask.projectId)
          )
        : undefined;

      if (foundCurrentProject !== undefined) {
        updateProject({
          ...foundCurrentProject,
          countTasks: Math.max(0, foundCurrentProject.countTasks - 1),
        });
      }

      removeTask(taskId);
    },
    [tasks, projects]
  );

  return <DeleteTaskModal onSuccess={onSuccess} />;
};
