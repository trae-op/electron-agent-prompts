import { type Event, type WebContentsWillRedirectEventParams } from "electron";
import { ipcMainOn, ipcWebContentsSend } from "../@shared/utils.js";
import { getWindow } from "../@shared/control-window/receive.js";
import { openWindow } from "./window.js";
import { getElectronStorage, setElectronStorage } from "../@shared/store.js";
import { cacheUser } from "../@shared/cache-responses.js";
import { messages } from "../config.js";
import { logout } from "../@shared/services/logout.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";

export function registerIpc(): void {
  ipcMainOn("logout", () => {
    logout();
  });

  ipcMainOn("checkAuth", () => {
    const mainWindow = getWindow<TWindows["main"]>("window:main");
    const userId = getElectronStorage("userId");
    const userFromCache = cacheUser(userId);

    if (mainWindow !== undefined) {
      ipcWebContentsSend("auth", mainWindow.webContents, {
        isAuthenticated: Boolean(userFromCache),
      });
    }
  });

  ipcMainOn("windowAuth", (_, { provider }) => {
    const window = openWindow(provider);
    const mainWindow = getWindow<TWindows["main"]>("window:main");

    window.webContents.on(
      "will-redirect",
      async (_: Event<WebContentsWillRedirectEventParams>, url: string) => {
        const isVerify = /api\/auth\/verify\?token\=/g.test(url);
        const isUserExists = /api\/auth\/user\-exists\?message\=/g.test(url);
        const callBackUrl = new URL(url);
        const searchParams = new URLSearchParams(callBackUrl.search);

        if (isUserExists) {
          window.close();
          const message = searchParams.get("message");
          const email = searchParams.get("email");

          if (message !== null && email !== null) {
            showErrorMessages({
              title: messages.auth.userAlreadyExists,
              body: `${message}\nEmail: ${email}`,
            });
          }
        }

        if (isVerify) {
          const token = searchParams.get("token");
          const userId = searchParams.get("userId");

          if (token !== null && userId !== null && mainWindow !== undefined) {
            setElectronStorage("authToken", token);
            setElectronStorage("userId", userId);
            ipcWebContentsSend("auth", mainWindow.webContents, {
              isAuthenticated: true,
            });
          } else {
            showErrorMessages({
              title: messages.auth.errorTokenUserMissing,
              body: `Token=${token}\nUserId: ${userId}`,
            });
          }

          window.close();
        }
      }
    );
  });
}
