import { useSyncExternalStore } from "react";

import { useUpdateTaskContext } from "./useContext";

export const useUpdateTaskModalTaskSelector = (): TTask | undefined => {
  const { getTask, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getTask, getTask);
};

export const useUpdateTaskModalProjectsSelector = (): TProject[] => {
  const { getProjects, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getProjects, getProjects);
};

export const useSetUpdateTaskModalProjectsDispatch = () => {
  return useUpdateTaskContext().setProjects;
};

export const useSetUpdateTaskModalTaskDispatch = () => {
  return useUpdateTaskContext().setTask;
};

export const useUpdateTaskModalIdeSelector = (): string | undefined => {
  const { getIde, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getIde, getIde);
};

export const useUpdateTaskModalIsSkillsSelector = (): boolean => {
  const { getIsSkills, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getIsSkills, getIsSkills);
};

export const useSetUpdateTaskModalIdeDispatch = () => {
  return useUpdateTaskContext().setIde;
};

export const useSetUpdateTaskModalIsSkillsDispatch = () => {
  return useUpdateTaskContext().setIsSkills;
};

export const useUpdateTaskModalIsSettingsSelector = (): boolean => {
  const { getIsSettings, subscribe } = useUpdateTaskContext();

  return useSyncExternalStore(subscribe, getIsSettings, getIsSettings);
};

export const useSetUpdateTaskModalIsSettingsDispatch = () => {
  return useUpdateTaskContext().setIsSettings;
};
