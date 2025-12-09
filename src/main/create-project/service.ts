import { post } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";

export async function createProject(
  payload: TEventPayloadSend["createProject"]
): Promise<boolean | undefined> {
  const response = await post<boolean>(
    `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.projects.base}`,
    payload
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by createProject",
      body: response.error.message,
    });

    return undefined;
  }

  return response.data;
}
