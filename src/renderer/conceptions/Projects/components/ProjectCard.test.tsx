import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectCard } from "./ProjectCard";

const createProject = (overrides: Partial<TProject> = {}): TProject => ({
  id: overrides.id ?? "project-alpha",
  name: overrides.name ?? "Project Alpha",
  created: overrides.created ?? new Date("2024-01-01T00:00:00.000Z"),
  updated: overrides.updated ?? new Date("2024-01-03T00:00:00.000Z"),
  countTasks: overrides.countTasks ?? 2,
});

describe("ProjectCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders project information and prompt count", async () => {
    const project = createProject();

    render(
      <ProjectCard
        project={project}
        onOpen={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const card = await screen.findByTestId(`project-card-${project.id}`);

    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent(project.name);
    expect(card).toHaveTextContent("Created: Jan 1, 2024");
    expect(card).toHaveTextContent("Updated: Jan 3, 2024");
    expect(card).toHaveTextContent("2 Prompts");
  });

  it("invokes onOpen when the card action area is clicked", async () => {
    const project = createProject();
    const onOpen = vi.fn();
    const user = userEvent.setup();

    render(
      <ProjectCard
        project={project}
        onOpen={onOpen}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const actionArea = await screen.findByTestId(
      `project-card-area-${project.id}`
    );

    await user.click(actionArea);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(project);
  });

  it("invokes edit and delete callbacks without triggering open", async () => {
    const project = createProject();
    const onOpen = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <ProjectCard
        project={project}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const editButton = await screen.findByTestId(`project-edit-${project.id}`);
    const deleteButton = await screen.findByTestId(
      `project-delete-${project.id}`
    );

    await user.click(editButton);
    await user.click(deleteButton);

    expect(onEdit).toHaveBeenCalledWith(project);
    expect(onDelete).toHaveBeenCalledWith(project);
    expect(onOpen).not.toHaveBeenCalled();
  });
});
