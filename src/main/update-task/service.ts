import { readFile } from "fs/promises";
import path from "node:path";
import { put } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";
import { getStore, setStore } from "../@shared/store.js";
import { cacheWindows } from "../@shared/control-window/cache.js";

export async function updateTask(
  payload: TEventSendInvoke["updateTask"]
): Promise<TTask | undefined> {
  const { id, ...data } = payload;
  const formData = new FormData();
  const filePath = getStore<string, string>("uploadedFilePath");
  const endpoint = `${restApi.urls.base}${restApi.urls.baseApi}${
    restApi.urls.tasks.base
  }${restApi.urls.tasks.byId(id + "")}`;

  const hasFile = typeof filePath === "string" && filePath.length > 0;

  if (hasFile && filePath !== undefined) {
    const fileBuffer = await readFile(filePath);
    const blob = new Blob([fileBuffer]);

    formData.append("file", blob, path.basename(filePath));
  }

  formData.append("name", data.name);
  formData.append("projectId", `${data.projectId}`);

  if (data.fileId !== undefined) {
    formData.append("fileId", data.fileId);
  }

  formData.append("url", data.url ?? "");

  const response = await put<TTask>(endpoint, formData, {
    ...(hasFile
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {}),
  });

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by updateTask",
      body: response.error.message,
    });

    return undefined;
  }

  if (data.fileId !== undefined) {
    const hasCacheWindow = cacheWindows.has(`window:task/${id}`);
    if (hasCacheWindow !== undefined) {
      cacheWindows.delete(`window:task/${id}`);
    }
  }

  setStore("uploadedFilePath", undefined);
  return response.data;
}
