import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../@shared/services/rest-api/service.js", () => ({
  __esModule: true,
  post: vi.fn(),
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
      },
    },
  },
}));

import { restApi } from "../config.js";
import { post } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { createProject } from "./service.js";

describe("createProject", () => {
  const payload: TEventSendInvoke["createProject"] = {
    name: "New Project",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the created project when the api call succeeds", async () => {
    const project: TProject = {
      id: "project-1",
      name: "New Project",
      created: new Date("2024-01-01T00:00:00.000Z"),
      updated: new Date("2024-01-01T00:00:00.000Z"),
      countTasks: 0,
    };

    vi.mocked(post).mockResolvedValue({
      status: 201,
      data: project,
      error: undefined,
    });

    const result = await createProject(payload);

    const expectedUrl = `${restApi.urls.base ?? ""}${restApi.urls.baseApi}${
      restApi.urls.projects.base
    }`;
    expect(post).toHaveBeenCalledWith(expectedUrl, payload);
    expect(result).toEqual(project);
    expect(showErrorMessages).not.toHaveBeenCalled();
  });

  it("shows an error message and returns undefined when the api call fails", async () => {
    const error = { message: "Request failed" };

    vi.mocked(post).mockResolvedValue({
      status: 400,
      data: undefined,
      error,
    });

    const result = await createProject(payload);

    expect(showErrorMessages).toHaveBeenCalledWith({
      title: "Error request by createProject",
      body: error.message,
    });
    expect(result).toBeUndefined();
  });
});
