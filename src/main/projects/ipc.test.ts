import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

type THandler = (event: any, payload: any) => unknown;

let handlers: Record<string, THandler> = {};
let ipcMainOnMock: Mock;
let cacheProjectsMock: Mock;
let getProjectsMock: Mock;

vi.mock("../@shared/utils.js", () => {
  ipcMainOnMock = vi.fn((channel: string, handler: THandler) => {
    handlers[channel] = handler;
  });

  return {
    ipcMainOn: ipcMainOnMock,
  };
});

vi.mock("../@shared/cache-responses.js", () => {
  cacheProjectsMock = vi.fn();

  return {
    cacheProjects: cacheProjectsMock,
  };
});

vi.mock("./service.js", () => {
  getProjectsMock = vi.fn();

  return {
    getProjects: getProjectsMock,
  };
});

describe("projects registerIpc", () => {
  beforeEach(async () => {
    handlers = {};
    vi.resetModules();
    vi.clearAllMocks();
    const { registerIpc } = await import("./ipc.js");
    registerIpc();
  });

  it("registers the projects channel handler", () => {
    expect(ipcMainOnMock).toHaveBeenCalledWith(
      "projects",
      expect.any(Function)
    );
    expect(handlers.projects).toBeTypeOf("function");
  });

  it("replies with cached and refreshed projects when available", async () => {
    const handler = handlers.projects;
    expect(handler).toBeTypeOf("function");

    const cachedProjects: TProject[] = [
      {
        id: "project-cached",
        name: "Cached",
        created: new Date("2024-01-01T00:00:00.000Z"),
        updated: new Date("2024-01-02T00:00:00.000Z"),
        countTasks: 2,
      },
    ];

    const refreshedProjects: TProject[] = [
      {
        id: "project-fresh",
        name: "Fresh",
        created: new Date("2024-02-01T00:00:00.000Z"),
        updated: new Date("2024-02-02T00:00:00.000Z"),
        countTasks: 5,
      },
    ];

    cacheProjectsMock.mockReturnValue(cachedProjects);
    getProjectsMock.mockResolvedValue(refreshedProjects);

    const event = { reply: vi.fn() };

    await handler?.(event, undefined);

    expect(cacheProjectsMock).toHaveBeenCalledTimes(1);
    expect(getProjectsMock).toHaveBeenCalledTimes(1);
    expect(event.reply).toHaveBeenNthCalledWith(1, "projects", {
      projects: cachedProjects,
    });
    expect(event.reply).toHaveBeenNthCalledWith(2, "projects", {
      projects: refreshedProjects,
    });
  });

  it("replies only with refreshed projects when cache misses", async () => {
    const handler = handlers.projects;
    expect(handler).toBeTypeOf("function");

    const refreshedProjects: TProject[] = [
      {
        id: "project-fresh",
        name: "Fresh",
        created: new Date("2024-02-01T00:00:00.000Z"),
        updated: new Date("2024-02-02T00:00:00.000Z"),
        countTasks: 5,
      },
    ];

    cacheProjectsMock.mockReturnValue(undefined);
    getProjectsMock.mockResolvedValue(refreshedProjects);

    const event = { reply: vi.fn() };

    await handler?.(event, undefined);

    expect(cacheProjectsMock).toHaveBeenCalledTimes(1);
    expect(event.reply).toHaveBeenCalledTimes(1);
    expect(event.reply).toHaveBeenCalledWith("projects", {
      projects: refreshedProjects,
    });
  });

  it("does nothing when no data is available", async () => {
    const handler = handlers.projects;
    expect(handler).toBeTypeOf("function");

    cacheProjectsMock.mockReturnValue(undefined);
    getProjectsMock.mockResolvedValue(undefined);

    const event = { reply: vi.fn() };

    await handler?.(event, undefined);

    expect(event.reply).not.toHaveBeenCalled();
  });
});
