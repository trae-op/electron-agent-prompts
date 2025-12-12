import { del } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";

export async function deleteTask(
  payload: TEventSendInvoke["deleteTask"]
): Promise<boolean> {
  const response = await del<undefined>(
    `${restApi.urls.base}${restApi.urls.baseApi}${
      restApi.urls.tasks.base
    }${restApi.urls.tasks.byId(payload.id)}`
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by deleteTask",
      body: response.error.message,
    });

    return false;
  }

  return true;
}
