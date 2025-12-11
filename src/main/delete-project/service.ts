import { del } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";

export async function deleteProject(
  payload: TEventSendInvoke["deleteProject"]
): Promise<boolean> {
  const response = await del<undefined>(
    `${restApi.urls.base}${restApi.urls.baseApi}${
      restApi.urls.projects.base
    }${restApi.urls.projects.byId(payload.id)}`
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by deleteProject",
      body: response.error.message,
    });

    return false;
  }

  return true;
}
