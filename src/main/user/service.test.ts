import { describe, it, expect, beforeEach, vi } from "vitest";

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
import { getUserById } from "./service.js";

describe("getUserById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user data when the API call succeeds", async () => {
    const userId = "123";
    const user: TUser = {
      id: 1,
      email: "user@example.com",
      sourceId: "source-1",
      provider: "google",
      firstName: "Test",
      lastName: "User",
    };

    vi.mocked(get).mockResolvedValue({
      data: user,
      error: undefined,
      status: 200,
    });

    const result = await getUserById<typeof user>(userId);

    expect(result).toEqual(user);
    expect(get).toHaveBeenCalledWith(
      `${restApi.urls.base}${restApi.urls.baseApi}${
        restApi.urls.user.base
      }${restApi.urls.user.byId(userId)}`,
      {
        isCache: true,
      }
    );
    expect(showErrorMessages).not.toHaveBeenCalled();
  });

  it("shows an error message when the API call fails", async () => {
    const userId = "456";
    const error = { message: "Request failed" };

    vi.mocked(get).mockResolvedValue({
      data: undefined,
      error,
      status: 500,
    });

    const result = await getUserById(userId);

    expect(result).toBeUndefined();
    expect(showErrorMessages).toHaveBeenCalledWith({
      title: "Error request by getUserById",
      body: error.message,
      isDialog: false,
    });
  });
});
