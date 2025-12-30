const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  receive: {
    subscribeUpdateApp: (
      callback: (payload: TEventPayloadReceive["updateApp"]) => void
    ) =>
      ipcOn("updateApp", (payload) => {
        callback(payload);
      }),
    subscribeWindowAuth: (
      callback: (payload: TEventPayloadReceive["auth"]) => void
    ) =>
      ipcOn("auth", (payload) => {
        callback(payload);
      }),
    subscribeWindowTask: (
      callback: (payload: TEventPayloadReceive["task"]) => void
    ) =>
      ipcOn("task", (payload) => {
        callback(payload);
      }),
    subscribeWindowOpenUpdateApp: (
      callback: (payload: TEventPayloadReceive["openUpdateApp"]) => void
    ) =>
      ipcOn("openUpdateApp", (payload) => {
        callback(payload);
      }),
    subscribeUpdateTask: (
      callback: (payload: TEventPayloadReceive["updateTask"]) => void
    ) =>
      ipcOn("updateTask", (payload) => {
        callback(payload);
      }),
    subscribeUser: (
      callback: (payload: TEventPayloadReceive["user"]) => void
    ) =>
      ipcOn("user", (payload) => {
        callback(payload);
      }),
    subscribeProjects: (
      callback: (payload: TEventPayloadReceive["projects"]) => void
    ) =>
      ipcOn("projects", (payload) => {
        callback(payload);
      }),
    subscribeTasks: (
      callback: (payload: TEventPayloadReceive["tasks"]) => void
    ) =>
      ipcOn("tasks", (payload) => {
        callback(payload);
      }),
  },
  send: {
    restart: () => {
      ipcSend("restart");
    },
    user: () => {
      ipcSend("user");
    },
    projects: () => {
      ipcSend("projects");
    },
    tasks: (payload: TEventPayloadSend["tasks"]) => {
      ipcSend("tasks", payload);
    },
    task: (payload: TEventPayloadSend["task"]) => {
      ipcSend("task", payload);
    },
    windowTask: (payload: TEventPayloadSend["windowTask"]) => {
      ipcSend("windowTask", payload);
    },
    checkForUpdates: () => {
      ipcSend("checkForUpdates");
    },
    checkAuth: () => {
      ipcSend("checkAuth");
    },
    logout: () => {
      ipcSend("logout");
    },
    windowAuth: (payload: TEventPayloadSend["windowAuth"]) => {
      ipcSend("windowAuth", payload);
    },
    windowClosePreload: () => {
      ipcSend("windowClosePreload");
    },
    openLatestVersion: (payload: TEventPayloadSend["openLatestVersion"]) => {
      ipcSend("openLatestVersion", payload);
    },
    windowOpenUpdate: (payload: TEventPayloadSend["openUpdate"]) => {
      ipcSend("openUpdate", payload);
    },
  },
  invoke: {
    getVersion: () => ipcInvoke("getVersion"),
    createProject: (payload) => ipcInvoke("createProject", payload),
    updateProject: (payload) => ipcInvoke("updateProject", payload),
    deleteProject: (payload) => ipcInvoke("deleteProject", payload),
    createTask: (payload) => ipcInvoke("createTask", payload),
    updateTask: (payload) => ipcInvoke("updateTask", payload),
    deleteTask: (payload) => ipcInvoke("deleteTask", payload),
    markdownContent: (payload) => ipcInvoke("markdownContent", payload),
    uploadFile: (payload) => {
      const filePath = electron.webUtils.getPathForFile(payload.file);
      payload.path = filePath;
      return ipcInvoke("uploadFile", payload);
    },
    uploadConnectionInstructionFile: (payload) => {
      const filePath = electron.webUtils.getPathForFile(payload.file);
      payload.path = filePath;
      return ipcInvoke("uploadConnectionInstructionFile", payload);
    },
    resolveFilePath: (file) =>
      electron.webUtils.getPathForFile(file) ?? undefined,
  },
} satisfies Window["electron"]);

function ipcInvoke<
  Key extends keyof TEventPayloadInvoke,
  S extends keyof TEventSendInvoke
>(key: Key, payload?: TEventSendInvoke[S]): Promise<TEventPayloadInvoke[Key]> {
  return electron.ipcRenderer.invoke(key, payload);
}

function ipcSend<Key extends keyof TEventPayloadSend>(
  key: Key,
  payload?: TEventPayloadSend[Key]
) {
  electron.ipcRenderer.send(key, payload);
}

function ipcOn<Key extends keyof TEventPayloadReceive>(
  key: Key,
  callback: (payload: TEventPayloadReceive[Key]) => void
) {
  const cb = (
    _: Electron.IpcRendererEvent,
    payload: TEventPayloadReceive[Key]
  ) => callback(payload);

  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}
