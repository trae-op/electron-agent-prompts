import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Provider } from "../context/Context";
import { ProjectsOverview } from "./ProjectsOverview";

const handleCreateProject = vi.fn();
const handleOpenProject = vi.fn();
const handleEditProject = vi.fn();
const handleDeleteProject = vi.fn();

const mockActions = {
  handleCreateProject,
  handleOpenProject,
  handleEditProject,
  handleDeleteProject,
};

vi.mock("../hooks", () => ({
  useProjectsActions: () => mockActions,
}));

const createProject = (overrides: Partial<TProject> = {}): TProject => ({
  id: overrides.id ?? "project-overview",
  name: overrides.name ?? "Overview Project",
  created: overrides.created ?? new Date("2024-04-01T00:00:00.000Z"),
  updated: overrides.updated ?? new Date("2024-04-03T00:00:00.000Z"),
  countTasks: overrides.countTasks ?? 7,
});

describe("ProjectsOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the empty state when there are no projects", async () => {
    const user = userEvent.setup();

    render(
      <Provider initialProjects={[]}>
        <ProjectsOverview />
      </Provider>
    );

    expect(screen.getByTestId("projects-overview")).toBeInTheDocument();
    expect(screen.getByTestId("projects-empty-state")).toBeInTheDocument();

    await user.click(screen.getByTestId("projects-empty-action"));

    expect(handleCreateProject).toHaveBeenCalledTimes(1);
  });

  it("renders the projects grid and wires action handlers", async () => {
    const project = createProject({ id: "project-alpha" });
    const user = userEvent.setup();

    render(
      <Provider initialProjects={[project]}>
        <ProjectsOverview />
      </Provider>
    );

    expect(screen.getByTestId("projects-grid")).toBeInTheDocument();
    expect(screen.queryByTestId("projects-empty-state")).toBeNull();

    const cardArea = await screen.findByTestId(
      `project-card-area-${project.id}`
    );
    const editButton = await screen.findByTestId(`project-edit-${project.id}`);
    const deleteButton = await screen.findByTestId(
      `project-delete-${project.id}`
    );

    await user.click(cardArea);
    await user.click(editButton);
    await user.click(deleteButton);

    expect(handleOpenProject).toHaveBeenCalledWith(project);
    expect(handleEditProject).toHaveBeenCalledWith(project);
    expect(handleDeleteProject).toHaveBeenCalledWith(project);
  });
});
