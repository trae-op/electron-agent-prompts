import {
  BrowserWindow,
  ipcMain,
  type WebFrameMain,
  type WebContents,
  type IpcMainEvent,
} from "electron";
import { restApi, windows } from "../config.js";
``;

export const buildDeleteTaskEndpoint = (taskId: number): string =>
  `${restApi.urls.base}${restApi.urls.baseApi}${
    restApi.urls.tasks.base
  }${restApi.urls.tasks.byId(taskId + "")}`;

export const buildTasksEndpoint = (projectId: number): string =>
  `${restApi.urls.base}${restApi.urls.baseApi}${
    restApi.urls.tasks.base
  }${restApi.urls.tasks.byProjectId(projectId)}`;

export const buildTaskEndpoint = (taskId: string): string =>
  `${restApi.urls.base}${restApi.urls.baseApi}${
    restApi.urls.tasks.base
  }${restApi.urls.tasks.byId(taskId)}`;

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isPlatform(platform: NodeJS.Platform): boolean {
  return process.platform === platform;
}

export function ipcMainHandle<Key extends keyof TEventSendInvoke>(
  key: Key,
  handle: (
    payload?: TEventSendInvoke[Key]
  ) => TEventPayloadInvoke[Key] | Promise<TEventPayloadInvoke[Key]>
) {
  ipcMain.handle(key, async (event, payload?: TEventSendInvoke[Key]) => {
    validateEventFrame(event.senderFrame);

    return await handle(payload);
  });
}

export function ipcWebContentsSend<Key extends keyof TEventPayloadReceive>(
  key: Key,
  webContentsSend: WebContents,
  payload: TEventPayloadReceive[Key]
) {
  webContentsSend.send(key, payload);
}

export function ipcWebContentsBroadcast<Key extends keyof TEventPayloadReceive>(
  key: Key,
  payload: TEventPayloadReceive[Key]
) {
  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send(key, payload);
    }
  });
}

export function ipcMainOn<Key extends keyof TEventPayloadSend>(
  key: Key,
  callback: (event: IpcMainEvent, payload: TEventPayloadSend[Key]) => void
): void {
  ipcMain.on(key, (event: IpcMainEvent, data: TEventPayloadSend[Key]) => {
    callback(event, data);
  });
}

function containsAnyIdentifier(
  fullUrl: string,
  identifiers: string[]
): boolean {
  if (identifiers.some((identifier) => fullUrl.includes(identifier))) {
    return true;
  }

  return /\/\d+(\/|$)/.test(fullUrl);
}

export function validateEventFrame(frame: WebFrameMain | null) {
  if (frame === null) {
    throw new Error("Invalid frame: Frame is null");
  }

  const url = new URL(frame.url);

  if (
    isDev() &&
    url.host === `localhost:${process.env.LOCALHOST_ELECTRON_SERVER_PORT}`
  ) {
    return;
  }

  const isPresent = containsAnyIdentifier(frame.url, Object.values(windows));

  if (
    (!isPresent && url.hash !== "") ||
    (url.protocol !== "file:" && url.hash === "")
  ) {
    throw new Error(`The event is from an unauthorized frame: ${frame.url}`);
  }
}
