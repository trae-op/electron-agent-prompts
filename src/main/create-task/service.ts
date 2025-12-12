import { post } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";

export async function createTask(
  payload: TEventSendInvoke["createTask"]
): Promise<TTask | undefined> {
  const response = await post<TTask>(
    `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.tasks.base}`,
    payload
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by createTask",
      body: response.error.message,
    });

    return undefined;
  }

  return response.data;
}
