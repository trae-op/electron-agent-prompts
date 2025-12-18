import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";
import { buildTasksEndpoint } from "../@shared/utils.js";

export async function getTasks<R extends TTask[]>(
  projectId: number
): Promise<R | undefined> {
  const response = await get<R>(buildTasksEndpoint(projectId), {
    isCache: true,
  });

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by getTasks",
      body: response.error.message,
    });
  }

  return response.data;
}
