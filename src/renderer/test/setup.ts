import "@testing-library/jest-dom";
import { vi } from "vitest";

const noopUnsubscribe = () => {
  return undefined;
};

window.electron = {
  receive: {
    subscribeUpdateApp: vi.fn(() => noopUnsubscribe),
    subscribeWindowAuth: vi.fn(() => noopUnsubscribe),
    subscribeWindowOpenUpdateApp: vi.fn(() => noopUnsubscribe),
    subscribeUser: vi.fn(() => noopUnsubscribe),
    subscribeProjects: vi.fn(() => noopUnsubscribe),
    subscribeUpdateTask: vi.fn(() => noopUnsubscribe),
    subscribeWindowTask: vi.fn(() => noopUnsubscribe),
    subscribeTasks: vi.fn(() => noopUnsubscribe),
  },
  send: {
    restart: vi.fn(),
    windowClosePreload: vi.fn(),
    user: vi.fn(),
    projects: vi.fn(),
    tasks: vi.fn(),
    task: vi.fn(),
    checkAuth: vi.fn(),
    logout: vi.fn(),
    checkForUpdates: vi.fn(),
    windowAuth: vi.fn(),
    windowTask: vi.fn(),
    openLatestVersion: vi.fn(),
    windowOpenUpdate: vi.fn(),
  },
  invoke: {
    getVersion: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    uploadFile: vi.fn(),
    markdownContent: vi.fn(),
    resolveFilePath: vi.fn(),
  },
};
