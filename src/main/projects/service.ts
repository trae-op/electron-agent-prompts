import { restApi } from "../config.js";
import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";

export async function getProjects<R extends TProject[]>(): Promise<
  R | undefined
> {
  const response = await get<R>(
    `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.projects.base}`,
    {
      isCache: true,
    }
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by getProjects",
      body: response.error.message,
    });
  }

  return response.data;
}
