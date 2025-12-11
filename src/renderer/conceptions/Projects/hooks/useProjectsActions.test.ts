import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useProjectsActions } from "./useProjectsActions";

const createProject = (): TProject => ({
  id: "project-test",
  name: "Test Project",
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-01-02T00:00:00.000Z"),
  countTasks: 3,
});

describe("useProjectsActions", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    infoSpy.mockRestore();
  });

  it("logs when opening a project", () => {
    const project = createProject();
    const { result } = renderHook(() => useProjectsActions());

    act(() => {
      result.current.handleOpenProject(project);
    });

    expect(infoSpy).toHaveBeenCalledWith("[Projects] Open project", project.id);
  });

  it("logs when deleting a project", () => {
    const project = createProject();
    const { result } = renderHook(() => useProjectsActions());

    act(() => {
      result.current.handleDeleteProject(project);
    });

    expect(infoSpy).toHaveBeenCalledWith(
      "[Projects] Delete project",
      project.id
    );
  });
});
