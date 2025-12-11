import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../hooks", () => ({
  __esModule: true,
  useProjectsActions: vi.fn(),
}));

vi.mock("./ProjectsGrid", () => ({
  __esModule: true,
  ProjectsGrid: vi.fn(() => <div data-testid="projects-grid-mock" />),
}));

vi.mock("@conceptions/UpdateProject", () => ({
  __esModule: true,
  useUpdateProjectModalActions: vi.fn(),
}));

import { Provider } from "../context";
import { ProjectsOverview } from "../../../windows/home/ProjectsOverview";
import { useProjectsActions } from "../hooks";
import { ProjectsGrid } from "./ProjectsGrid";
import { useUpdateProjectModalActions } from "@conceptions/UpdateProject";

const createProject = (id: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-01-02T00:00:00.000Z"),
  countTasks: 1,
});

describe("ProjectsOverview", () => {
  beforeEach(() => {
    vi.mocked(useProjectsActions).mockReset();
    vi.mocked(ProjectsGrid).mockClear();
    vi.mocked(useUpdateProjectModalActions).mockReset();
    vi.mocked(useUpdateProjectModalActions).mockReturnValue({
      openModal: vi.fn(),
    });
  });

  it("renders an empty state when no projects exist", () => {
    vi.mocked(useProjectsActions).mockReturnValue({
      handleOpenProject: vi.fn(),
      handleDeleteProject: vi.fn(),
    });

    render(
      <Provider initialProjects={[]} initialIsLoading={false}>
        <ProjectsOverview />
      </Provider>
    );

    expect(screen.getByTestId("projects-overview")).toBeInTheDocument();
    expect(screen.getByText("Not found any projects!")).toBeInTheDocument();
    expect(ProjectsGrid).not.toHaveBeenCalled();
  });

  it("renders the grid with fetched projects", () => {
    const projects = [createProject("a"), createProject("b")];
    const actions = {
      handleOpenProject: vi.fn(),
      handleDeleteProject: vi.fn(),
    };
    const openModal = vi.fn();
    vi.mocked(useProjectsActions).mockReturnValue(actions);
    vi.mocked(useUpdateProjectModalActions).mockReturnValue({
      openModal,
    });

    render(
      <Provider initialProjects={projects} initialIsLoading={false}>
        <ProjectsOverview />
      </Provider>
    );

    expect(
      screen.queryByText("Not found any projects!")
    ).not.toBeInTheDocument();

    const mock = vi.mocked(ProjectsGrid);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock.mock.calls[0]?.[0]).toMatchObject({
      projects,
      onOpen: actions.handleOpenProject,
      onEdit: expect.any(Function),
      onDelete: actions.handleDeleteProject,
    });

    const gridProps = mock.mock.calls[0]?.[0];
    expect(gridProps).toBeDefined();
    gridProps?.onEdit(projects[0]);
    expect(openModal).toHaveBeenCalledWith(projects[0]);
  });
});
