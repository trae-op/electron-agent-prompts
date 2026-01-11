import axios from "axios";
import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { buildTaskEndpoint } from "../@shared/utils.js";
import { parseMarkdownFileContent } from "./utils/markdown.js";
import { saveMarkdownContent } from "./utils/storage.js";

export async function getTask<R extends TTask>(
  taskId: string
): Promise<R | undefined> {
  const response = await get<R>(buildTaskEndpoint(taskId), {
    isCache: true,
  });

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by getTask",
      body: response.error.message,
    });
  }

  return response.data;
}

export async function downloadByUrl(url: string): Promise<Blob | undefined> {
  try {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });

    const headerContentType = response.headers["content-type"];
    const contentType = Array.isArray(headerContentType)
      ? headerContentType[0]
      : headerContentType ?? "application/octet-stream";

    return new Blob([response.data], {
      type: contentType,
    });
  } catch (error) {
    showErrorMessages({
      title: "Error downloading file",
      body: error instanceof Error ? error.message : String(error),
    });

    return undefined;
  }
}

export async function loadMarkdownContentFromTaskUrl(
  task: TTask
): Promise<TMarkdownContent[] | undefined> {
  if (!task.url) {
    return undefined;
  }

  const response = await get<string>(task.url, {
    responseType: "text",
    isCache: false,
  });

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by loadMarkdownContentFromTaskUrl",
      body: response.error.message,
    });
    return undefined;
  }

  if (typeof response.data !== "string") {
    return undefined;
  }

  const parsedContents = parseMarkdownFileContent(response.data);

  if (parsedContents.length === 0) {
    return undefined;
  }

  saveMarkdownContent({
    taskId: String(task.id),
    contents: parsedContents,
  });

  return parsedContents;
}
