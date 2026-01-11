import {
  getElectronStorage,
  getStore,
  setElectronStorage,
} from "../../@shared/store.js";

const CONNECTION_INSTRUCTION_STORAGE_KEY = "connectionInstructionFiles";

type TConnectionInstructionEntry = {
  ide?: string;
  isSkills?: boolean;
};

export function saveConnectionInstruction(payload: {
  projectId: string;
  taskId: string;
  ide?: string;
  isSkills?: boolean;
}) {
  const storage = getElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY) ?? {};
  const projectInstructions = storage[payload.projectId] ?? {};

  const normalizedIde = payload.ide?.trim();

  if (normalizedIde === undefined || normalizedIde.length === 0) {
    if (projectInstructions[payload.taskId] === undefined) {
      return;
    }

    delete projectInstructions[payload.taskId];

    if (Object.keys(projectInstructions).length === 0) {
      const { [payload.projectId]: _, ...restProjects } = storage;
      setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, restProjects);
      return;
    }

    setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, {
      ...storage,
      [payload.projectId]: projectInstructions,
    });

    return;
  }

  setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, {
    ...storage,
    [payload.projectId]: {
      ...projectInstructions,
      [payload.taskId]: {
        ide: normalizedIde,
        isSkills: payload.isSkills,
      },
    },
  });
}

export function deleteConnectionInstruction(
  taskId: string,
  projectId?: string
) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY) ?? {};
  const projectInstructions = storage[projectKey];

  if (
    projectInstructions === undefined ||
    projectInstructions[taskId] === undefined
  ) {
    return;
  }

  const { [taskId]: _, ...restTasks } = projectInstructions;

  if (Object.keys(restTasks).length === 0) {
    const { [projectKey]: __, ...restProjects } = storage;
    setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, restProjects);
    return;
  }

  setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, {
    ...storage,
    [projectKey]: restTasks,
  });
}

export function getConnectionInstructionByTaskId(
  taskId: string,
  projectId?: string
): TConnectionInstructionEntry | undefined {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY) ?? {};
  const projectInstructions = storage[projectKey] ?? {};

  return projectInstructions[taskId];
}

export function getConnectionInstructionByProjectId(projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY) ?? {};

  return storage[projectKey];
}
