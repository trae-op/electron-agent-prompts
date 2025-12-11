import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../@shared/utils.js", () => ({
  __esModule: true,
  ipcMainHandle: vi.fn(),
}));

vi.mock("./service.js", () => ({
  __esModule: true,
  updateProject: vi.fn(),
}));

import { ipcMainHandle } from "../@shared/utils.js";
import { updateProject } from "./service.js";
import { registerIpc } from "./ipc.js";

describe("update-project ipc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupHandler = () => {
    let captured:
      | ((
          payload?: TEventSendInvoke["updateProject"]
        ) => Promise<TEventPayloadInvoke["updateProject"]>)
      | undefined;

    vi.mocked(ipcMainHandle).mockImplementationOnce((channel, handler) => {
      captured = handler as typeof captured;
      expect(channel).toBe("updateProject");
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
      "updateProject",
      expect.any(Function)
    );
  });

  it("returns undefined when no payload is provided", async () => {
    const handler = setupHandler();

    const result = await handler(undefined);

    expect(result).toBeUndefined();
    expect(updateProject).not.toHaveBeenCalled();
  });

  it("delegates to the service when a payload is provided", async () => {
    const handler = setupHandler();
    const payload: TEventSendInvoke["updateProject"] = {
      id: "project-1",
      name: "Updated name",
    };
    const project: TProject = {
      id: "project-1",
      name: "Updated name",
      created: new Date("2024-01-01T00:00:00.000Z"),
      updated: new Date("2024-02-01T00:00:00.000Z"),
      countTasks: 10,
    };

    vi.mocked(updateProject).mockResolvedValue(project);

    const result = await handler(payload);

    expect(updateProject).toHaveBeenCalledWith(payload);
    expect(result).toEqual(project);
  });
});
