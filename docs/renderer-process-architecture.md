# Renderer Process Architecture

This document describes the architecture and maintenance guidelines for the React renderer process located in `src/renderer`.

## 1. Directory Structure

The renderer process follows a component-based architecture with separation of concerns between UI, logic, and domain concepts.

```
src/renderer/
├── assets/            # Static assets (images, fonts)
├── components/        # Reusable, dumb UI components
├── composites/        # Higher-order components combining logic and UI (e.g., Routes)
├── conceptions/       # Domain-specific modules (Logic + State + UI)
│   ├── <Domain>/      # e.g., Auth, User
│   │   ├── components/# Domain-specific components
│   │   ├── hooks/     # Domain-specific hooks (IPC, state)
│   │   ├── context/   # React Context for the domain
│   │   └── index.ts   # Public API for the domain
├── config/            # Renderer-specific configuration
├── hooks/             # General custom hooks
├── layouts/           # Page layouts (e.g., MainLayout)
├── utils/             # Helper functions
├── windows/           # Page-level components (Entry points for routes)
├── App.tsx            # Main application component and routing
└── main.tsx           # React entry point
```

## 2. Routing and Windows

- **`App.tsx`**: Defines the application routes using `react-router-dom`.
- **Windows**: Each Electron window typically corresponds to a route.
  - Components for these routes are located in `src/renderer/windows/`.
  - Example: A route `/window:main` renders `src/renderer/windows/home/Home.tsx`.
- **Lazy Loading**: Use `React.lazy` and `Suspense` for route components to optimize performance.

## 3. Conceptions (Domain Modules)

"Conceptions" represent distinct business domains (e.g., Authentication, User Management).

- **Structure**: A conception folder should contain everything related to that domain:
  - `context/`: Providers for global state (e.g., `AuthProvider`).
  - `hooks/`: Hooks to access state or perform actions (e.g., `useAuth`, `useLogin`).
  - `components/`: UI components specific to this domain.
- **Usage**: Wrap the application (or part of it) with the domain's Provider in `App.tsx`.

## 4. IPC Integration

- **Access**: IPC is accessed via `window.electron` (exposed by preload script).
- **Pattern**: Do not call `window.electron` directly in UI components.
- **Abstraction**: Create custom hooks to wrap IPC calls.
  - Example: `useClosePreloadWindow` in `src/renderer/hooks/`.
  - Example: Domain-specific IPC calls should be inside hooks within `src/renderer/conceptions/<Domain>/hooks/`.

## 5. Components vs. Composites

- **Components**: Pure UI components. Should receive data via props and be reusable.
- **Composites**: Components that handle logic, side effects, or wrap other components.
  - Example: `PrivateRoute` checks authentication state and redirects if necessary.

## 6. Styling

- The project uses CSS modules or global CSS (`index.css`).
- Keep styles co-located with components if using CSS modules.

## 7. Adding a New Feature

1.  **Define Domain**: If it's a new domain, create a folder in `conceptions/`.
2.  **IPC**: If it needs backend communication, add methods to `preload.cts` (main) and wrap them in a hook in `conceptions/<Domain>/hooks/`.
3.  **State**: If it needs global state, create a Context Provider in `conceptions/<Domain>/context/`.
4.  **UI**: Create components in `conceptions/<Domain>/components/` or `src/renderer/components/` if generic.
5.  **Route**: If it's a new page, add a component in `src/renderer/windows/` and a route in `App.tsx`.
