import { deleteFromElectronStorage } from "../store.js";
import { ipcWebContentsBroadcast } from "../utils.js";

export async function logout() {
  deleteFromElectronStorage("authToken");
  deleteFromElectronStorage("response");
  deleteFromElectronStorage("userId");
  ipcWebContentsBroadcast("auth", { isAuthenticated: false });
}
