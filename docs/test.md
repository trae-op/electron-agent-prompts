### 1. Mocking Electron

```typescript
import { vi } from "vitest";

vi.mock("electron", () => ({
  app: {
    getPath: vi.fn().mockReturnValue("/tmp"),
  },
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn(),
  },
  BrowserWindow: vi.fn().mockImplementation(() => ({
    loadURL: vi.fn(),
    show: vi.fn(),
  })),
}));
```

### 2. Testing Services (Example)

Suppose you have a service `src/main/user/service.ts` that fetches a user.

```typescript
// src/main/user/service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserById } from "./service.js";
import * as RestApi from "../@shared/services/rest-api/service.js";
import * as ErrorMessages from "../@shared/services/error-messages.js";

// Mock dependencies
vi.mock("../@shared/services/rest-api/service.js");
vi.mock("../@shared/services/error-messages.js");

describe("User Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user data when API call is successful", async () => {
    const mockUser = { id: "1", name: "Test User" };

    // Mock the 'get' function from rest-api service
    vi.mocked(RestApi.get).mockResolvedValue({
      data: mockUser,
      error: undefined,
    });

    const result = await getUserById("1");

    expect(result).toEqual(mockUser);
    expect(RestApi.get).toHaveBeenCalled();
  });

  it("should show error message when API call fails", async () => {
    const mockError = { message: "Network Error" };

    vi.mocked(RestApi.get).mockResolvedValue({
      data: undefined,
      error: mockError,
    });

    await getUserById("1");

    expect(ErrorMessages.showErrorMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        body: "Network Error",
      })
    );
  });
});
```
