import {
  getElectronStorage,
  getStore,
  setElectronStorage,
} from "../../@shared/store.js";

const FOLDERS_STORAGE_KEY = "foldersContentFiles";

export function normalizeFolders(folders: string[]): string[] {
  return Array.from(
    new Set(
      folders
        .map((folder) => folder.trim())
        .filter((folder) => folder.length > 0)
    )
  );
}

export function saveFoldersContent(payload: {
  projectId: string;
  taskId: string;
  folders: string[];
}) {
  const normalizedFolders = normalizeFolders(payload.folders);
  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[payload.projectId] ?? {};

  if (normalizedFolders.length === 0) {
    delete projectFolders[payload.taskId];

    if (Object.keys(projectFolders).length === 0) {
      const { [payload.projectId]: _, ...restProjects } = storage;
      setElectronStorage(FOLDERS_STORAGE_KEY, restProjects);
      return;
    }

    setElectronStorage(FOLDERS_STORAGE_KEY, {
      ...storage,
      [payload.projectId]: projectFolders,
    });

    return;
  }

  setElectronStorage(FOLDERS_STORAGE_KEY, {
    ...storage,
    [payload.projectId]: {
      ...projectFolders,
      [payload.taskId]: normalizedFolders,
    },
  });
}

export function deleteFoldersContent(taskId: string, projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[projectKey];

  if (projectFolders === undefined || projectFolders[taskId] === undefined) {
    return;
  }

  const { [taskId]: _, ...restTasks } = projectFolders;

  if (Object.keys(restTasks).length === 0) {
    const { [projectKey]: __, ...restProjects } = storage;
    setElectronStorage(FOLDERS_STORAGE_KEY, restProjects);
    return;
  }

  setElectronStorage(FOLDERS_STORAGE_KEY, {
    ...storage,
    [projectKey]: restTasks,
  });
}

export function deleteProjectFoldersContent(projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[projectKey];

  if (projectFolders === undefined) {
    return;
  }

  delete storage[projectKey];

  setElectronStorage(FOLDERS_STORAGE_KEY, storage);
}

export function getFoldersContentByTaskId(taskId: string, projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[projectKey] ?? {};

  return projectFolders[taskId];
}

export function getFoldersContentByProjectId(projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[projectKey] ?? {};

  return projectFolders;
}
