import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import { ProjectsSubscriber } from "./ProjectsSubscriber";

const useSetProjectsDispatchMock = vi.fn();
const useSetProjectsLoadingDispatchMock = vi.fn();

vi.mock("../context/useSelectors", () => ({
  useSetProjectsDispatch: () => useSetProjectsDispatchMock(),
  useSetProjectsLoadingDispatch: () => useSetProjectsLoadingDispatchMock(),
}));

type TProjectsCallback = (payload: { projects: TProject[] }) => void;

const createProject = (id: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-01-02T00:00:00.000Z"),
  countTasks: 0,
});

describe("ProjectsSubscriber", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSetProjectsDispatchMock.mockReturnValue(() => undefined);
    useSetProjectsLoadingDispatchMock.mockReturnValue(() => undefined);
  });

  it("requests the projects list when mounted", async () => {
    render(<ProjectsSubscriber />);

    await waitFor(() => {
      expect(window.electron.send.projects).toHaveBeenCalledTimes(1);
    });
  });

  it("subscribes to project updates and forwards payloads to the dispatchers", () => {
    const setProjects = vi.fn();
    const setProjectsLoading = vi.fn();
    useSetProjectsDispatchMock.mockReturnValue(setProjects);
    useSetProjectsLoadingDispatchMock.mockReturnValue(setProjectsLoading);

    let receivedCallback: TProjectsCallback | null = null;
    const unsubscribe = vi.fn();
    const subscribeProjectsMock = vi
      .spyOn(window.electron.receive, "subscribeProjects")
      .mockImplementation((callback: TProjectsCallback) => {
        receivedCallback = callback;
        return unsubscribe;
      });

    const { unmount } = render(<ProjectsSubscriber />);

    expect(subscribeProjectsMock).toHaveBeenCalledTimes(1);
    expect(receivedCallback).not.toBeNull();

    const projects = [createProject("alpha"), createProject("beta")];
    if (receivedCallback === null) {
      throw new Error("subscribeProjects did not provide a callback");
    }

    (receivedCallback as TProjectsCallback)({ projects });

    expect(setProjects).toHaveBeenCalledWith(projects);
    expect(setProjectsLoading).toHaveBeenCalledWith(false);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
