import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../@shared/services/rest-api/service.js", () => ({
  __esModule: true,
  put: vi.fn(),
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
import { put } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { updateProject } from "./service.js";

describe("updateProject", () => {
  const payload: TEventSendInvoke["updateProject"] = {
    id: "project-1",
    name: "Updated name",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the updated project when the api call succeeds", async () => {
    const project: TProject = {
      id: "project-1",
      name: "Updated name",
      created: new Date("2024-01-01T00:00:00.000Z"),
      updated: new Date("2024-02-01T00:00:00.000Z"),
      countTasks: 10,
    };

    vi.mocked(put).mockResolvedValue({
      status: 200,
      data: project,
      error: undefined,
    });

    const result = await updateProject(payload);

    const expectedUrl = `${restApi.urls.base ?? ""}${restApi.urls.baseApi}${
      restApi.urls.projects.base
    }${restApi.urls.projects.byId(payload.id)}`;

    expect(put).toHaveBeenCalledWith(expectedUrl, { name: payload.name });
    expect(result).toEqual(project);
    expect(showErrorMessages).not.toHaveBeenCalled();
  });

  it("shows an error message and returns undefined when the api call fails", async () => {
    const error = { message: "Request failed" };

    vi.mocked(put).mockResolvedValue({
      status: 400,
      data: undefined,
      error,
    });

    const result = await updateProject(payload);

    const expectedUrl = `${restApi.urls.base ?? ""}${restApi.urls.baseApi}${
      restApi.urls.projects.base
    }${restApi.urls.projects.byId(payload.id)}`;

    expect(put).toHaveBeenCalledWith(expectedUrl, { name: payload.name });
    expect(showErrorMessages).toHaveBeenCalledWith({
      title: "Error request by updateProject",
      body: error.message,
    });
    expect(result).toBeUndefined();
  });
});
