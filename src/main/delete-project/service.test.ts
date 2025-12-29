import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../@shared/services/rest-api/service.js", () => ({
  __esModule: true,
  del: vi.fn(),
}));

vi.mock("../@shared/services/error-messages.js", () => ({
  __esModule: true,
  showErrorMessages: vi.fn(),
}));

vi.mock("../config.js", () => ({
  __esModule: true,
  restApi: {
    urls: {
      base: "https://api.example.com",
      baseApi: "/api",
      projects: {
        base: "/projects",
        byId: (id: string) => `/${id}`,
      },
    },
  },
}));

import { restApi } from "../config.js";
import { del } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { deleteProject } from "./service.js";

describe("deleteProject", () => {
  const payload: TEventSendInvoke["deleteProject"] = {
    id: "project-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true when the api call succeeds", async () => {
    vi.mocked(del).mockResolvedValue({
      status: 200,
      data: undefined,
      error: undefined,
    });

    const result = await deleteProject(payload);

    const expectedUrl = `${restApi.urls.base ?? ""}${restApi.urls.baseApi}${
      restApi.urls.projects.base
    }${restApi.urls.projects.byId(payload.id)}`;

    expect(del).toHaveBeenCalledWith(expectedUrl, payload.id);
    expect(result).toBe(true);
    expect(showErrorMessages).not.toHaveBeenCalled();
  });

  it("shows an error message and returns false when the api call fails", async () => {
    const error = { message: "Request failed" };

    vi.mocked(del).mockResolvedValue({
      status: 400,
      data: undefined,
      error,
    });

    const result = await deleteProject(payload);

    expect(showErrorMessages).toHaveBeenCalledWith({
      title: "Error request by deleteProject",
      body: error.message,
    });
    expect(result).toBe(false);
  });
});
