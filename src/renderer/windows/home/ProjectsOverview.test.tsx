import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useProjectsSelectorMock = vi.fn();
const useProjectsLoadingSelectorMock = vi.fn();
const useClosePreloadWindowMock = vi.fn();
const openUpdateProjectModalMock = vi.fn();
const openDeleteProjectModalMock = vi.fn();

type TProjectsGridProps = {
  projects: TProject[];
  onOpen: (project: TProject) => void;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
};

let capturedProjectsGridProps: TProjectsGridProps | undefined;

const { ProjectsGridMock } = vi.hoisted(() => ({
  ProjectsGridMock: vi.fn((props: TProjectsGridProps) => {
    capturedProjectsGridProps = props;
    return <div data-testid="projects-grid" />;
  }),
}));

vi.mock("@conceptions/Projects/context", () => ({
  useProjectsSelector: () => useProjectsSelectorMock(),
  useProjectsLoadingSelector: () => useProjectsLoadingSelectorMock(),
}));

vi.mock("@hooks/closePreloadWindow", () => ({
  useClosePreloadWindow: () => useClosePreloadWindowMock(),
}));

vi.mock("@conceptions/UpdateProject", () => ({
  useUpdateProjectModalActions: () => ({
    openModal: openUpdateProjectModalMock,
  }),
}));

vi.mock("@conceptions/DeleteProject", () => ({
  useDeleteProjectModalActions: () => ({
    openModal: openDeleteProjectModalMock,
  }),
}));

vi.mock("@conceptions/Projects/components/ProjectsGrid", () => ({
  ProjectsGrid: ProjectsGridMock,
}));

import { ProjectsOverview } from "./ProjectsOverview";

describe("ProjectsOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedProjectsGridProps = undefined;
  });

  it("renders loading state when projects are fetching", () => {
    useProjectsSelectorMock.mockReturnValue([]);
    useProjectsLoadingSelectorMock.mockReturnValue(true);

    render(<ProjectsOverview />);

    expect(screen.getByTestId("loading-spinner-container")).toBeInTheDocument();
    expect(ProjectsGridMock).not.toHaveBeenCalled();
  });

  it("renders empty state when there are no projects", () => {
    useProjectsSelectorMock.mockReturnValue([]);
    useProjectsLoadingSelectorMock.mockReturnValue(false);

    render(<ProjectsOverview />);

    expect(screen.getByTestId("projects-overview")).toBeInTheDocument();
    expect(screen.getByText("Not found any projects!")).toBeInTheDocument();
    expect(ProjectsGridMock).not.toHaveBeenCalled();
  });

  it("renders projects grid and wires callbacks", () => {
    const project: TProject = {
      id: "string",
      name: "string",
      created: new Date(),
      updated: new Date(),
      countTasks: 0,
    };

    useProjectsSelectorMock.mockReturnValue([project]);
    useProjectsLoadingSelectorMock.mockReturnValue(false);

    const consoleInfoSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => {});

    render(<ProjectsOverview />);

    expect(useClosePreloadWindowMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("projects-grid")).toBeInTheDocument();
    expect(capturedProjectsGridProps?.projects).toEqual([project]);

    capturedProjectsGridProps?.onEdit(project);
    expect(openUpdateProjectModalMock).toHaveBeenCalledWith(project);

    capturedProjectsGridProps?.onDelete(project);
    expect(openDeleteProjectModalMock).toHaveBeenCalledWith(project);

    capturedProjectsGridProps?.onOpen(project);
    expect(consoleInfoSpy).toHaveBeenCalledWith("Open project", project.id);

    consoleInfoSpy.mockRestore();
  });
});
