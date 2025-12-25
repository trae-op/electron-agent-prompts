import { readFile } from "fs/promises";
import path from "node:path";
import { post } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";
import { getStore, setStore } from "../@shared/store.js";

export async function createTask(
  payload: TEventSendInvoke["createTask"]
): Promise<
  | {
      task: TTask;
      fileBlob: Blob | undefined;
      fileName: string | undefined;
    }
  | undefined
> {
  const formData = new FormData();
  const filePath = getStore<string, string>("uploadedFilePath");
  let fileBlob: Blob | undefined;
  let fileName: string | undefined;

  if (filePath) {
    const fileBuffer = await readFile(filePath);
    fileBlob = new Blob([fileBuffer]);
    fileName = path.basename(filePath);

    formData.append("file", fileBlob, fileName);
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

  if (!response.data) {
    return undefined;
  }

  setStore("uploadedFilePath", undefined);

  return {
    task: response.data,
    fileBlob,
    fileName,
  };
}
