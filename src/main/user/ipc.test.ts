import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

type THandler = (event: any, payload: any) => unknown;

let handlers: Record<string, THandler> = {};
let ipcMainOnMock: Mock;
let getElectronStorageMock: Mock;
let cacheUserMock: Mock;
let getUserByIdMock: Mock;

vi.mock("../@shared/utils.js", () => {
  ipcMainOnMock = vi.fn((channel: string, handler: THandler) => {
    handlers[channel] = handler;
  });

  return {
    ipcMainOn: ipcMainOnMock,
  };
});

vi.mock("../@shared/store.js", () => {
  getElectronStorageMock = vi.fn();
  return {
    getElectronStorage: getElectronStorageMock,
  };
});

vi.mock("../@shared/cache-responses.js", () => {
  cacheUserMock = vi.fn();
  return {
    cacheUser: cacheUserMock,
  };
});

vi.mock("./service.js", () => {
  getUserByIdMock = vi.fn();
  return {
    getUserById: getUserByIdMock,
  };
});

describe("registerIpc", () => {
  beforeEach(async () => {
    handlers = {};
    vi.resetModules();
    vi.clearAllMocks();
    const { registerIpc } = await import("./ipc.js");
    registerIpc();
  });

  it("registers the user channel handler", () => {
    expect(ipcMainOnMock).toHaveBeenCalledWith("user", expect.any(Function));
    expect(handlers.user).toBeTypeOf("function");
  });

  it("replies with cached data and refreshed user when available", async () => {
    const handler = handlers.user;
    expect(handler).toBeTypeOf("function");

    const cachedUser: TUser = {
      id: 1,
      email: "cached@example.com",
      sourceId: "cache-1",
      provider: "google",
    };

    const freshUser: TUser = {
      ...cachedUser,
      email: "fresh@example.com",
    };

    getElectronStorageMock.mockReturnValue("user-123");
    cacheUserMock.mockReturnValue(cachedUser);
    getUserByIdMock.mockResolvedValue(freshUser);

    const event = { reply: vi.fn() };

    await handler?.(event, undefined);

    expect(cacheUserMock).toHaveBeenCalledWith("user-123");
    expect(getUserByIdMock).toHaveBeenCalledWith("user-123");
    expect(event.reply).toHaveBeenNthCalledWith(1, "user", {
      user: cachedUser,
    });
    expect(event.reply).toHaveBeenNthCalledWith(2, "user", { user: freshUser });
  });

  it("replies with fetched user when cache misses", async () => {
    const handler = handlers.user;
    expect(handler).toBeTypeOf("function");

    const fetchedUser: TUser = {
      id: 2,
      email: "fresh@example.com",
      sourceId: "fresh-1",
      provider: "facebook",
    };

    getElectronStorageMock.mockReturnValue("user-456");
    cacheUserMock.mockReturnValue(undefined);
    getUserByIdMock.mockResolvedValue(fetchedUser);

    const event = { reply: vi.fn() };

    await handler?.(event, undefined);

    expect(cacheUserMock).toHaveBeenCalledWith("user-456");
    expect(getUserByIdMock).toHaveBeenCalledWith("user-456");
    expect(event.reply).toHaveBeenCalledTimes(1);
    expect(event.reply).toHaveBeenCalledWith("user", { user: fetchedUser });
  });

  it("does nothing when there is no stored user id", async () => {
    const handler = handlers.user;
    expect(handler).toBeTypeOf("function");

    getElectronStorageMock.mockReturnValue(undefined);
    cacheUserMock.mockReturnValue(undefined);
    getUserByIdMock.mockResolvedValue(undefined);

    const event = { reply: vi.fn() };

    await handler?.(event, undefined);

    expect(cacheUserMock).toHaveBeenCalledWith(undefined);
    expect(getUserByIdMock).not.toHaveBeenCalled();
    expect(event.reply).not.toHaveBeenCalled();
  });
});
