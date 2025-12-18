import { restApi } from "../config.js";
import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";

export async function getTask<R extends TTask>(
  taskId: string
): Promise<R | undefined> {
  const response = await get<R>(
    `${restApi.urls.base}${restApi.urls.baseApi}${
      restApi.urls.tasks.base
    }${restApi.urls.tasks.byId(taskId)}`,
    {
      isCache: true,
    }
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by getTask",
      body: response.error.message,
      isDialog: false,
    });
  }

  return response.data;
}
