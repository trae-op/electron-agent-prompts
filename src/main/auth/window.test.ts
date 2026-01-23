import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import type { BrowserWindow } from "electron";
import type { TLessProviders } from "./types.js";

let fromPartitionMock: Mock = vi.fn();
let createWindowMock: Mock = vi.fn();

vi.mock("electron", () => {
  return {
    BrowserWindow: vi.fn(),
    session: {
      fromPartition: fromPartitionMock,
    },
  };
});

const restApiMock = {
  urls: {
    base: "https://example.com",
    baseApi: "/api",
    auth: {
      base: "/auth/",
      google: "google",
    },
  },
};

vi.mock("../config.js", () => ({ restApi: restApiMock }));

vi.mock("../@shared/control-window/create.js", () => {
  return { createWindow: createWindowMock };
});

describe("openWindow", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("creates an auth window with the partition set to persist:auth", async () => {
    const { openWindow } = await import("./window.js");

    const browserWindowStub = { id: "auth-window" } as unknown as BrowserWindow;

    createWindowMock.mockReturnValue(browserWindowStub);

    const result = openWindow("google" as keyof TLessProviders);

    expect(createWindowMock).toHaveBeenCalledTimes(1);

    const args = createWindowMock.mock.calls[0]?.[0];
    expect(args).toMatchObject({
      hash: "window:auth",
      loadURL: "https://example.com/api/auth/google",
    });

    expect(args.options).toMatchObject({
      autoHideMenuBar: true,
      minimizable: false,
      maximizable: false,
      title: "",
      width: 400,
      height: 400,
    });

    expect(args.options?.webPreferences?.partition).toBe("persist:auth");
    expect(result).toBe(browserWindowStub);
  });
});
