import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Provider } from "./Context";
import { useProjectsSelector } from "./useSelectors";

const ProjectsConsumer = () => {
  const projects = useProjectsSelector();
  const firstIsDate =
    projects.length > 0 && projects[0].created instanceof Date;

  return (
    <div>
      <span data-testid="projects-count">{projects.length}</span>
      <span data-testid="projects-first-created-is-date">
        {firstIsDate ? "true" : "false"}
      </span>
    </div>
  );
};

describe("Projects Context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests projects via IPC and normalizes incoming payloads", async () => {
    const unsubscribe = vi.fn();
    let capturedCallback:
      | ((payload: { projects: TProject[] }) => void)
      | undefined;

    window.electron.receive.subscribeProjects = vi.fn((callback) => {
      capturedCallback = callback;
      return unsubscribe;
    });

    window.electron.send.projects = vi.fn();

    render(
      <Provider initialProjects={[]}>
        <ProjectsConsumer />
      </Provider>
    );

    expect(window.electron.send.projects).toHaveBeenCalledTimes(1);
    expect(window.electron.receive.subscribeProjects).toHaveBeenCalledTimes(1);

    const projectsPayload = [
      {
        id: "project-abc",
        name: "ABC",
        created: new Date("2024-04-10T00:00:00.000Z"),
        updated: new Date("2024-04-12T00:00:00.000Z"),
        countTasks: 4,
      },
    ];

    await act(async () => {
      capturedCallback?.({ projects: projectsPayload });
    });

    expect(screen.getByTestId("projects-count")).toHaveTextContent("1");
    expect(
      screen.getByTestId("projects-first-created-is-date").textContent
    ).toBe("true");
    expect(unsubscribe).not.toHaveBeenCalled();
  });
});
