# Main Process Architecture

This document describes the architecture and maintenance guidelines for the Electron main process located in `src/main`.

## 1. Directory Structure

The main process code is organized by feature, with a shared directory for common utilities.

```
src/main/
├── @shared/           # Shared utilities, types, and helpers
│   ├── control-window/# Window creation/destruction logic
│   ├── menu/          # Application menu configuration
│   ├── services/      # Shared services (e.g., REST API, error handling)
│   ├── tray/          # System tray logic
│   ├── store.ts       # Electron store wrapper
│   └── utils.ts       # General utilities (IPC wrappers, env checks)
├── <feature>/         # Feature-specific modules (e.g., auth, user, updater)
│   ├── ipc.ts         # IPC event handlers registration
│   ├── service.ts     # Business logic and external API calls
│   ├── types.ts       # Feature-specific types
│   └── window.ts      # Window configuration (if applicable)
├── app.ts             # Application entry point
├── config.ts          # Global configuration (URLs, window names)
└── preload.cts        # Context bridge and preload script
```

## 2. Application Entry Point (`app.ts`)

- **Responsibility**: Initializes the Electron app, creates the main window, sets up the tray and menu, and registers IPC listeners.
- **Maintenance**:
  - Keep this file clean. Delegate logic to feature modules or shared services.
  - Register new feature IPC modules here using their `registerIpc` function.

## 3. Feature Modules

Each feature (e.g., `auth`, `user`) should be self-contained in its own directory.

### IPC Handlers (`ipc.ts`)

- **Purpose**: Registers IPC listeners for the feature.
- **Pattern**: Export a `registerIpc` function.
- **Usage**: Use `ipcMainOn` and `ipcMainHandle` from `@shared/utils.ts` for type-safe IPC handling.
- **Example**:

  ```typescript
  import { ipcMainOn } from "../@shared/utils.js";
  import { someService } from "./service.js";

  export function registerIpc(): void {
    ipcMainOn("channelName", (event, payload) => {
      // Call service logic
      someService(payload);
    });
  }
  ```

### Services (`service.ts`)

- **Purpose**: Contains pure business logic, API calls, and data processing.
- **Guidelines**:
  - Do not import Electron modules (like `ipcMain`) directly if possible; keep logic testable.
  - Use shared REST API helpers (`@shared/services/rest-api`) for network requests.

## 4. Shared Utilities (`@shared`)

- **`utils.ts`**: Contains `ipcMainOn`, `ipcMainHandle`, and `ipcWebContentsSend`. Always use these wrappers instead of raw `ipcMain` to ensure type safety with global types.
- **`store.ts`**: Wrapper around `electron-store` for persistent data.
- **`control-window`**: Logic for creating and managing browser windows.

## 5. Configuration (`config.ts`)

- Store global constants, API URLs, and window identifiers here.
- Do not hardcode strings in feature files; reference `config.ts`.

## 6. Preload Script (`preload.cts`)

- Exposes a type-safe API to the renderer via `contextBridge`.
- Maps IPC channels to methods on `window.electron`.
- **Maintenance**: When adding a new IPC channel, update the `window.electron` interface in `preload.cts` and the corresponding global types.

## 7. Type Safety

- The project relies on global types (likely in `types/`) for IPC payloads (`TEventPayloadSend`, `TEventPayloadReceive`, etc.).
- Ensure all IPC channels are defined in these global types before using them in `ipc.ts` or `preload.cts`.
