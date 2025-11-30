## TypeScript guidelines for GitHub Copilot

These rules tell GitHub Copilot how to generate and modify TypeScript in this project so that new code fits the existing patterns in both **main** and **renderer** processes.

---

## 1. Shared TypeScript principles

- **Strict typing:**
  - Prefer explicit types on public functions, IPC handlers, and exported values.
  - Use existing global types from `types/*.d.ts` instead of redefining shapes.
  - Avoid `any`; if a type is unknown, introduce or refine a shared type first.
- **Domain‑driven types:**
  - For new features, define reusable types in the appropriate `types/*.d.ts` file (e.g. `user.d.ts`, `invokes.d.ts`, `sends.d.ts`, `receives.d.ts`).
  - Keep cross‑process contracts (IPC payloads) only in `types/` so both main and renderer import from the same source of truth.
- **Small, pure functions:**
  - Keep functions short and single‑purpose.
  - For logic that does not depend on Electron or React, write pure functions that are easy to test.
- **Consistent naming:**
  - Use descriptive names: verbs for functions (`fetchUser`, `checkForUpdates`), nouns for types/interfaces (`TUser`, `TAuthPayload`).
  - Follow the existing `T*` convention for key global types (e.g. `TWindows`).
  - For IPC type maps, keep `TEventSendInvoke`, `TEventPayloadInvoke`, `TEventPayloadReceive`, `TEventPayloadSend` style naming.

---

## 2. Main process TypeScript (`src/main`)

- **Module style:**
  - Use `import`/`export` ES modules with `.js` extensions for compiled imports (e.g. `"./@shared/utils.js"`).
  - Do not change existing import extensions; align with current files when adding new imports.
- **Electron typings:**
  - Always use the Electron type imports (`BrowserWindow`, `IpcMainEvent`, `WebContents`, `WebFrameMain`) from `electron` when wiring handlers.
  - IPC helpers in `@shared/utils.ts` already type `ipcMainHandle`, `ipcMainOn`, `ipcWebContentsSend`; reuse them instead of calling `ipcMain.handle` directly.
- **IPC handler signatures:**
  - For `ipcMainHandle`:
    - Key must be a `keyof TEventSendInvoke`.
    - Handler returns `TEventPayloadInvoke[Key] | Promise<TEventPayloadInvoke[Key]>`.
  - For `ipcMainOn`:
    - Key must be a `keyof TEventPayloadSend`.
    - Callback receives `(event: IpcMainEvent, payload: TEventPayloadSend[Key])`.
  - **Copilot rule:** never use untyped channel names or untyped payloads in new handlers.
- **Config and constants:**
  - Keep global constants in `config.ts`. When adding messages, window keys, or URLs, extend existing objects (`windows`, `messages`, `restApi`) instead of creating ad‑hoc constants elsewhere.
  - Use template literal helpers (like `user.byId`) for dynamic paths instead of manual string concatenation throughout the code.
- **Error handling:**
  - Throw `Error` with clear messages; let higher‑level services or IPC handlers decide how to surface them to the renderer.
  - Where possible, centralise user‑facing messages in `config.ts/messages` and keep exceptions for developer‑facing diagnostics.

---

## 3. Renderer process TypeScript (`src/renderer`)

- **React components:**
  - Use function components with properly typed props: `type Props = { ... }` then `export const Component = (props: Props) => { ... }`.
  - For components with no props, no explicit props type is required, but still use `FC` only when needed.
- **Hooks and context:**
  - Type custom hooks’ return values and parameters explicitly, especially for async hooks and hooks that wrap IPC.
  - When working with React context, define a `ContextValue` type and use it for both `createContext<ContextValue | undefined>` and `useContext`.
- **IPC and preload bridge:**
  - Do not call `window.electron` or `ipcRenderer` directly from components.
  - Add or extend IPC wrapper functions in the relevant `src/renderer/<feature>/ipc.ts` file.
  - Use global types from `types/*.d.ts` for the payloads so main and renderer stay in sync.
- **Routing and windows:**
  - Use `Route` paths that match `TWindows` values (e.g. `/window:main`, `/window:update-app`).
  - When adding routes, ensure the path matches the new value added to `config.ts/windows`.
- **Utility modules:**
  - For cross‑component helpers (dates, formatting, mapping IPC responses), put them under `renderer/utils` or inside a domain `conceptions/<Domain>/utils` file.
  - Type their inputs and outputs explicitly and keep them framework‑agnostic where possible.

---

## 4. Testing‑friendly TypeScript patterns

- Prefer injecting dependencies (e.g. API clients, IPC wrappers) into hooks or services where practical, so they can be mocked in unit tests.
- Keep stateful React logic inside hooks or small container components so pure helpers remain easy to unit‑test.
- Avoid side effects at module top‑level (except for configuration and one‑time Electron setup). Side effects should usually live in `useEffect` (renderer) or in `app` bootstrapping (main).

---

## 5. What Copilot should do before adding new types

- Look for an existing type in `types/*.d.ts` or `src/main/@shared` / `src/renderer` before creating a new one.
- If a new type is required:
  - Add or extend the closest matching `*.d.ts` file under `types/`.
  - Use that type in both main and renderer instead of duplicating interfaces.
- Maintain naming consistency and avoid leaking implementation details of the main process into renderer types (and vice versa).
