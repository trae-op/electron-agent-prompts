import { readFile } from "fs/promises";
import { post } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";
import { getStore, setStore } from "../@shared/store.js";
import path from "path/posix";

export async function createTask(
  payload: TEventSendInvoke["createTask"]
): Promise<TTask | undefined> {
  const formData = new FormData();
  const filePath = getStore<string, string>("uploadedFilePath");

  if (filePath) {
    const fileBuffer = await readFile(filePath);
    const blob = new Blob([fileBuffer]);
    formData.append("file", blob, path.basename(filePath));
  }

  formData.append("name", payload.name);
  formData.append("projectId", payload.projectId);

  const response = await post<TTask>(
    `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.tasks.base}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by createTask",
      body: response.error.message,
    });

    return undefined;
  }

  setStore("uploadedFilePath", undefined);
  return response.data;
}
