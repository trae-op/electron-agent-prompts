import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Provider } from "../context/Context";
import { ProjectsHeader } from "./ProjectsHeader";

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
  id: overrides.id ?? "project-header",
  name: overrides.name ?? "Header Project",
  created: overrides.created ?? new Date("2024-03-01T00:00:00.000Z"),
  updated: overrides.updated ?? new Date("2024-03-05T00:00:00.000Z"),
  countTasks: overrides.countTasks ?? 5,
});

describe("ProjectsHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the projects title and total count", () => {
    const projects: TProject[] = [
      createProject({ id: "project-1" }),
      createProject({ id: "project-2" }),
    ];

    render(
      <Provider initialProjects={projects}>
        <ProjectsHeader />
      </Provider>
    );

    const header = screen.getByTestId("projects-header");
    expect(header).toBeInTheDocument();
    expect(screen.getByTestId("projects-title")).toHaveTextContent(
      "My Projects"
    );
    expect(header).toHaveTextContent("Manage your agent prompt projects - 2");
  });

  it("invokes the create project action when the button is clicked", async () => {
    const projects: TProject[] = [createProject({ id: "project-single" })];
    const user = userEvent.setup();

    render(
      <Provider initialProjects={projects}>
        <ProjectsHeader />
      </Provider>
    );

    await user.click(screen.getByTestId("create-project-button"));

    expect(handleCreateProject).toHaveBeenCalledTimes(1);
  });
});
