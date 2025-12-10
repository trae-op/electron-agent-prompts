import { put } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";

export async function updateProject(
  payload: TEventSendInvoke["updateProject"]
): Promise<TProject | undefined> {
  const { id, ...data } = payload;

  const response = await put<TProject>(
    `${restApi.urls.base}${restApi.urls.baseApi}${
      restApi.urls.projects.base
    }${restApi.urls.projects.byId(id)}`,
    data
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by updateProject",
      body: response.error.message,
    });

    return undefined;
  }

  return response.data;
}
