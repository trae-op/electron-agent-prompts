import { restApi } from "../config.js";
import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";

export async function getUserById<R extends TUser>(
  id: string
): Promise<R | undefined> {
  const response = await get<R>(
    `${restApi.urls.base}${restApi.urls.baseApi}${
      restApi.urls.user.base
    }${restApi.urls.user.byId(id)}`,
    {
      isCache: true,
    }
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by getUserById",
      body: response.error.message,
    });
  }

  return response.data;
}
