import { restApi } from "../config.js";
import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";

export async function getTasks<R extends TTask[]>(): Promise<R | undefined> {
  const response = await get<R>(
    `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.tasks.base}`,
    {
      isCache: true,
    }
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by getTasks",
      body: response.error.message,
      isDialog: false,
    });
  }

  return response.data;
}
