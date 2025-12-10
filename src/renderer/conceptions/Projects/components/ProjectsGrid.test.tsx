import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./ProjectCard", () => ({
  __esModule: true,
  ProjectCard: vi.fn(({ project }: { project: TProject }) => (
    <div data-testid="project-card-mock">{project.id}</div>
  )),
}));

import { ProjectCard } from "./ProjectCard";
import { ProjectsGrid } from "./ProjectsGrid";

const createProject = (id: string, updated: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date(updated),
  countTasks: 1,
});

describe("ProjectsGrid", () => {
  it("sorts projects by updated date and renders a card for each", () => {
    const projects = [
      createProject("a", "2024-01-01T00:00:00.000Z"),
      createProject("b", "2024-02-01T00:00:00.000Z"),
      createProject("c", "2024-01-15T00:00:00.000Z"),
    ];
    const onOpen = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <ProjectsGrid
        projects={projects}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const rendered = screen
      .getAllByTestId("project-card-mock")
      .map((node) => node.textContent);
    expect(rendered).toEqual(["b", "c", "a"]);

    const mock = vi.mocked(ProjectCard);
    expect(mock).toHaveBeenCalledTimes(3);
    expect(mock.mock.calls[0]?.[0]).toMatchObject({
      project: projects[1],
      onOpen,
      onEdit,
      onDelete,
    });
  });
});
