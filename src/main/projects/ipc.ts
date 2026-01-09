import { ipcMainOn } from "../@shared/utils.js";
import { cacheProjects } from "../@shared/cache-responses.js";
import { getProjects } from "./service.js";
import { getStore, setStore } from "../@shared/store.js";

export function registerIpc(): void {
  ipcMainOn("projects", async (event: Electron.IpcMainEvent) => {
    const projectsFromCache = cacheProjects();

    if (projectsFromCache !== undefined) {
      event.reply("projects", {
        projects: projectsFromCache,
      });
    }

    const isStartProjects = getStore<boolean, string>("isStartProjects");

    if (isStartProjects) {
      setStore("isStartProjects", false);
      const projects = await getProjects();

      if (projects !== undefined) {
        event.reply("projects", {
          projects,
        });
      }
    }
  });
}
