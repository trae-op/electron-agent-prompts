import { setStore } from "../@shared/store.js";
import { ipcMainHandle } from "../@shared/utils.js";

export function registerIpc(): void {
  setStore("uploadConnectionInstructionFile", { path: "", ide: "vs-code" });

  ipcMainHandle("uploadConnectionInstructionFile", async (payload) => {
    if (payload === undefined) {
      return;
    }

    const { path, ide } = payload;

    setStore("uploadConnectionInstructionFile", {
      path: path ?? "",
      ide: ide ?? "vs-code",
    });

    return undefined;
  });
}
