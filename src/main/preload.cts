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
    subscribeWindowOpenUpdateApp: (
      callback: (payload: TEventPayloadReceive["openUpdateApp"]) => void
    ) =>
      ipcOn("openUpdateApp", (payload) => {
        callback(payload);
      }),
    subscribeUser: (
      callback: (payload: TEventPayloadReceive["user"]) => void
    ) =>
      ipcOn("user", (payload) => {
        callback(payload);
      }),
    subscribeCreateProject: (
      callback: (payload: TEventPayloadReceive["createProject"]) => void
    ) =>
      ipcOn("createProject", (payload) => {
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
    createProject: (payload: TEventPayloadSend["createProject"]) => {
      ipcSend("createProject", payload);
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
