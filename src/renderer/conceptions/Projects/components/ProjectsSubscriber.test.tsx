import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { Provider, useProjectsSelector } from "../context";
import { ProjectsSubscriber } from "./ProjectsSubscriber";

const ProjectsCount = () => {
  const projects = useProjectsSelector();
  return <span data-testid="projects-count">{projects.length}</span>;
};

const createProject = (id: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-01-02T00:00:00.000Z"),
  countTasks: 1,
});

describe("ProjectsSubscriber", () => {
  beforeEach(() => {
    window.electron.send.projects = vi.fn();
    window.electron.receive.subscribeProjects = vi.fn();
  });

  it("subscribes to project updates and updates context", () => {
    const unsubscribe = vi.fn();
    let capturedCallback:
      | ((payload: { projects: TProject[] }) => void)
      | undefined;
    window.electron.receive.subscribeProjects = vi.fn((callback) => {
      capturedCallback = callback;
      return unsubscribe;
    });

    const { unmount } = render(
      <Provider initialProjects={[]}>
        <ProjectsSubscriber />
        <ProjectsCount />
      </Provider>
    );

    expect(window.electron.send.projects).toHaveBeenCalledTimes(1);
    expect(window.electron.receive.subscribeProjects).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("projects-count")).toHaveTextContent("0");

    const nextProjects = [createProject("a")];
    act(() => {
      capturedCallback?.({ projects: nextProjects });
    });

    expect(screen.getByTestId("projects-count")).toHaveTextContent("1");

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
