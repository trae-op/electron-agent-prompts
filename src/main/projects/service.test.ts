import { beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  (process as NodeJS.Process & { resourcesPath?: string }).resourcesPath =
    process.cwd();
  process.env.BASE_REST_API = "https://api.example.com";
});

vi.mock("../@shared/services/rest-api/service.js", () => ({
  get: vi.fn(),
}));

vi.mock("../@shared/services/error-messages.js", () => ({
  showErrorMessages: vi.fn(),
}));

import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { restApi } from "../config.js";
import { getProjects } from "./service.js";

describe("getProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns projects when the API call succeeds", async () => {
    const projects: TProject[] = [
      {
        id: "project-1",
        name: "Test",
        created: new Date("2024-01-01T00:00:00.000Z"),
        updated: new Date("2024-01-02T00:00:00.000Z"),
        countTasks: 3,
      },
    ];

    vi.mocked(get).mockResolvedValue({
      data: projects,
      error: undefined,
      status: 200,
    });

    const result = await getProjects();

    expect(result).toEqual(projects);
    expect(get).toHaveBeenCalledWith(
      `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.projects.base}`,
      {
        isCache: true,
      }
    );
    expect(showErrorMessages).not.toHaveBeenCalled();
  });

  it("shows an error message when the API call fails", async () => {
    const error = { message: "Request failed" };

    vi.mocked(get).mockResolvedValue({
      data: undefined,
      error,
      status: 500,
    });

    const result = await getProjects();

    expect(result).toBeUndefined();
    expect(showErrorMessages).toHaveBeenCalledWith({
      title: "Error request by getProjects",
      body: error.message,
      isDialog: false,
    });
  });
});
