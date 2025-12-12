import { restApi } from "../config.js";
import { getElectronStorage } from "./store.js";

export function cacheUser(userId: string | undefined): TUser | undefined {
  let user: TUser | undefined = undefined;
  const cacheResponse = getElectronStorage("response");

  if (cacheResponse !== undefined && userId !== undefined) {
    user =
      cacheResponse[
        `${restApi.urls.base}${restApi.urls.baseApi}${
          restApi.urls.user.base
        }${restApi.urls.user.byId(userId)}`
      ];
  }

  if (user !== undefined) {
    return user;
  }

  return undefined;
}

export function cacheProjects(): TProject[] | undefined {
  const cacheResponse = getElectronStorage("response");

  if (cacheResponse === undefined) {
    return undefined;
  }

  const projects =
    cacheResponse[
      `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.projects.base}`
    ];

  if (Array.isArray(projects)) {
    return projects as TProject[];
  }

  return undefined;
}

export function cacheTasks(): TTask[] | undefined {
  const cacheResponse = getElectronStorage("response");

  if (cacheResponse === undefined) {
    return undefined;
  }

  const tasks =
    cacheResponse[
      `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.tasks.base}`
    ];

  if (Array.isArray(tasks)) {
    return tasks as TTask[];
  }

  return undefined;
}
