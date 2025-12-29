import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import type { Event, WebContentsWillRedirectEventParams } from "electron";
import type { TLessProviders } from "./types.js";

type THandler = (...args: any[]) => unknown;

let handlers: Record<string, THandler> = {};
let ipcMainOnMock: Mock;
let ipcWebContentsBroadcastMock: Mock;
let openWindowMock: Mock;
let getElectronStorageMock: Mock;
let setElectronStorageMock: Mock;
let cacheUserMock: Mock;
let logoutMock: Mock;
let showErrorMessagesMock: Mock;

vi.mock("../@shared/utils.js", () => {
  ipcMainOnMock = vi.fn((channel: string, handler: THandler) => {
    handlers[channel] = handler;
  });
  ipcWebContentsBroadcastMock = vi.fn();

  return {
    ipcMainOn: ipcMainOnMock,
    ipcWebContentsBroadcast: ipcWebContentsBroadcastMock,
  };
});

vi.mock("./window.js", () => {
  openWindowMock = vi.fn();
  return { openWindow: openWindowMock };
});

vi.mock("../@shared/store.js", () => {
  getElectronStorageMock = vi.fn();
  setElectronStorageMock = vi.fn();
  return {
    getElectronStorage: getElectronStorageMock,
    setElectronStorage: setElectronStorageMock,
  };
});

vi.mock("../@shared/cache-responses.js", () => {
  cacheUserMock = vi.fn();
  return { cacheUser: cacheUserMock };
});

vi.mock("../@shared/services/logout.js", () => {
  logoutMock = vi.fn();
  return { logout: logoutMock };
});

vi.mock("../@shared/services/error-messages.js", () => {
  showErrorMessagesMock = vi.fn();
  return { showErrorMessages: showErrorMessagesMock };
});

const messagesMock = {
  auth: {
    userAlreadyExists: "User already exists",
    errorTokenUserMissing: "Missing authentication data",
  },
};

vi.mock("../config.js", () => ({ messages: messagesMock }));

describe("registerIpc", () => {
  beforeEach(async () => {
    handlers = {};
    vi.resetModules();
    vi.clearAllMocks();
    const { registerIpc } = await import("./ipc.js");
    registerIpc();
  });

  it("registers logout handler", () => {
    const handler = handlers.logout;
    expect(handler).toBeTypeOf("function");

    handler?.();

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(ipcMainOnMock).toHaveBeenCalledWith("logout", expect.any(Function));
  });

  it("sends auth state during checkAuth when user is cached", () => {
    getElectronStorageMock.mockReturnValue("user-123");
    cacheUserMock.mockReturnValue({ id: "user-123" });

    const handler = handlers.checkAuth;
    expect(handler).toBeTypeOf("function");

    handler?.();

    expect(cacheUserMock).toHaveBeenCalledWith("user-123");
    expect(ipcWebContentsBroadcastMock).toHaveBeenCalledWith("auth", {
      isAuthenticated: true,
    });
  });

  it("opens auth window and handles user-exists redirect", () => {
    const windowStub = {
      close: vi.fn(),
      webContents: {
        on: vi.fn(),
      },
    };

    openWindowMock.mockReturnValue(windowStub);

    const handler = handlers.windowAuth;
    expect(handler).toBeTypeOf("function");

    handler?.({}, { provider: "google" as keyof TLessProviders });

    expect(openWindowMock).toHaveBeenCalledWith("google");

    const redirectHandler = (windowStub.webContents.on as Mock).mock
      .calls[0]?.[1];
    expect(redirectHandler).toBeTypeOf("function");

    const redirectUrl =
      "https://example.com/api/auth/user-exists?message=Already+registered&email=user%40example.com";

    redirectHandler?.(
      {} as Event<WebContentsWillRedirectEventParams>,
      redirectUrl
    );

    expect(windowStub.close).toHaveBeenCalledTimes(1);
    expect(showErrorMessagesMock).toHaveBeenCalledWith({
      title: messagesMock.auth.userAlreadyExists,
      body: "Already registered\nEmail: user@example.com",
    });
    expect(ipcWebContentsBroadcastMock).not.toHaveBeenCalled();
  });

  it("stores credentials and notifies main window on verify redirect", () => {
    const windowStub = {
      close: vi.fn(),
      webContents: {
        on: vi.fn(),
      },
    };

    openWindowMock.mockReturnValue(windowStub);

    const handler = handlers.windowAuth;
    handler?.({}, { provider: "google" as keyof TLessProviders });

    const redirectHandler = (windowStub.webContents.on as Mock).mock
      .calls[0]?.[1];
    const verifyUrl =
      "https://example.com/api/auth/verify?token=abc123&userId=789";

    redirectHandler?.(
      {} as Event<WebContentsWillRedirectEventParams>,
      verifyUrl
    );

    expect(setElectronStorageMock).toHaveBeenNthCalledWith(
      1,
      "authToken",
      "abc123"
    );
    expect(setElectronStorageMock).toHaveBeenNthCalledWith(2, "userId", "789");
    expect(ipcWebContentsBroadcastMock).toHaveBeenCalledWith("auth", {
      isAuthenticated: true,
    });
    expect(windowStub.close).toHaveBeenCalledTimes(1);
    expect(showErrorMessagesMock).not.toHaveBeenCalled();
  });

  it("shows an error when verify redirect lacks token or user id", () => {
    const windowStub = {
      close: vi.fn(),
      webContents: {
        on: vi.fn(),
      },
    };

    openWindowMock.mockReturnValue(windowStub);

    const handler = handlers.windowAuth;
    handler?.({}, { provider: "google" as keyof TLessProviders });

    const redirectHandler = (windowStub.webContents.on as Mock).mock
      .calls[0]?.[1];
    const invalidUrl = "https://example.com/api/auth/verify?token=abc123";

    redirectHandler?.(
      {} as Event<WebContentsWillRedirectEventParams>,
      invalidUrl
    );

    expect(showErrorMessagesMock).toHaveBeenCalledWith({
      title: messagesMock.auth.errorTokenUserMissing,
      body: "Token=abc123\nUserId: null",
    });
    expect(setElectronStorageMock).not.toHaveBeenCalled();
    expect(ipcWebContentsBroadcastMock).not.toHaveBeenCalled();
    expect(windowStub.close).toHaveBeenCalledTimes(1);
  });
});
