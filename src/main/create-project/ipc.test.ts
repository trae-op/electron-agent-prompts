import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../@shared/utils.js", () => ({
  __esModule: true,
  ipcMainHandle: vi.fn(),
}));

vi.mock("./service.js", () => ({
  __esModule: true,
  createProject: vi.fn(),
}));

import { ipcMainHandle } from "../@shared/utils.js";
import { createProject } from "./service.js";
import { registerIpc } from "./ipc.js";

describe("create-project ipc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupHandler = () => {
    let captured:
      | ((
          payload?: TEventSendInvoke["createProject"]
        ) => Promise<TEventPayloadInvoke["createProject"]>)
      | undefined;

    vi.mocked(ipcMainHandle).mockImplementationOnce((channel, handler) => {
      captured = handler as typeof captured;
      expect(channel).toBe("createProject");
    });

    registerIpc();

    if (captured === undefined) {
      throw new Error("Handler was not registered");
    }

    return captured;
  };

  it("registers the ipc handler", () => {
    registerIpc();

    expect(ipcMainHandle).toHaveBeenCalledWith(
      "createProject",
      expect.any(Function)
    );
  });

  it("returns undefined when no payload is provided", async () => {
    const handler = setupHandler();

    const result = await handler(undefined);

    expect(result).toBeUndefined();
    expect(createProject).not.toHaveBeenCalled();
  });

  it("delegates to the service when a payload is provided", async () => {
    const handler = setupHandler();
    const payload: TEventSendInvoke["createProject"] = { name: "Test" };
    const project: TProject = {
      id: "project-1",
      name: "Test",
      created: new Date("2024-01-01T00:00:00.000Z"),
      updated: new Date("2024-01-01T00:00:00.000Z"),
      countTasks: 0,
    };

    vi.mocked(createProject).mockResolvedValue(project);

    const result = await handler(payload);

    expect(createProject).toHaveBeenCalledWith(payload);
    expect(result).toEqual(project);
  });
});
