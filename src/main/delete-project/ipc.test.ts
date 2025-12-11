import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../@shared/utils.js", () => ({
  __esModule: true,
  ipcMainHandle: vi.fn(),
}));

vi.mock("./service.js", () => ({
  __esModule: true,
  deleteProject: vi.fn(),
}));

import { ipcMainHandle } from "../@shared/utils.js";
import { deleteProject } from "./service.js";
import { registerIpc } from "./ipc.js";

describe("delete-project ipc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupHandler = () => {
    let captured:
      | ((payload?: TEventSendInvoke["deleteProject"]) => Promise<boolean>)
      | undefined;

    vi.mocked(ipcMainHandle).mockImplementationOnce((channel, handler) => {
      captured = handler as typeof captured;
      expect(channel).toBe("deleteProject");
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
      "deleteProject",
      expect.any(Function)
    );
  });

  it("returns false when no payload is provided", async () => {
    const handler = setupHandler();

    const result = await handler(undefined);

    expect(result).toBe(false);
    expect(deleteProject).not.toHaveBeenCalled();
  });

  it("delegates to the service when a payload is provided", async () => {
    const handler = setupHandler();
    const payload: TEventSendInvoke["deleteProject"] = { id: "project-1" };

    vi.mocked(deleteProject).mockResolvedValue(true);

    const result = await handler(payload);

    expect(deleteProject).toHaveBeenCalledWith(payload);
    expect(result).toBe(true);
  });
});
