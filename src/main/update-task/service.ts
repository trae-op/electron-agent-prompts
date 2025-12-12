import { put } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";

export async function updateTask(
  payload: TEventSendInvoke["updateTask"]
): Promise<TTask | undefined> {
  const { id, ...data } = payload;

  const response = await put<TTask>(
    `${restApi.urls.base}${restApi.urls.baseApi}${
      restApi.urls.tasks.base
    }${restApi.urls.tasks.byId(id)}`,
    data
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by updateTask",
      body: response.error.message,
    });

    return undefined;
  }

  return response.data;
}
