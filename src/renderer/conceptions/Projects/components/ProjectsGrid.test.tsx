import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectsGrid } from "./ProjectsGrid";

const createProject = (overrides: Partial<TProject> = {}): TProject => ({
  id: overrides.id ?? "project-default",
  name: overrides.name ?? "Project",
  created: overrides.created ?? new Date("2024-02-01T00:00:00.000Z"),
  updated: overrides.updated ?? new Date("2024-02-05T00:00:00.000Z"),
  countTasks: overrides.countTasks ?? 4,
});

describe("ProjectsGrid", () => {
  it("renders a project card for each project and forwards callbacks", async () => {
    const firstProject = createProject({
      id: "project-one",
      name: "Project One",
    });
    const secondProject = createProject({
      id: "project-two",
      name: "Project Two",
    });
    const onOpen = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <ProjectsGrid
        projects={[firstProject, secondProject]}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const firstCard = await screen.findByTestId(
      `project-card-${firstProject.id}`
    );
    const secondCard = await screen.findByTestId(
      `project-card-${secondProject.id}`
    );

    expect(screen.getByTestId("projects-grid")).toBeInTheDocument();
    expect(firstCard).toHaveTextContent(firstProject.name);
    expect(secondCard).toHaveTextContent(secondProject.name);

    await user.click(
      screen.getByTestId(`project-card-area-${firstProject.id}`)
    );
    await user.click(screen.getByTestId(`project-edit-${secondProject.id}`));
    await user.click(screen.getByTestId(`project-delete-${secondProject.id}`));

    expect(onOpen).toHaveBeenCalledWith(firstProject);
    expect(onEdit).toHaveBeenCalledWith(secondProject);
    expect(onDelete).toHaveBeenCalledWith(secondProject);
  });

  it("updates rendered cards when the projects list changes", async () => {
    const initialProject = createProject({
      id: "project-initial",
      name: "Initial",
    });
    const nextProject = createProject({ id: "project-next", name: "Next" });

    const props = {
      onOpen: vi.fn(),
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    };

    const { rerender } = render(
      <ProjectsGrid projects={[initialProject]} {...props} />
    );

    await screen.findByTestId(`project-card-${initialProject.id}`);

    rerender(<ProjectsGrid projects={[nextProject]} {...props} />);

    await screen.findByTestId(`project-card-${nextProject.id}`);
    await waitFor(() => {
      expect(
        screen.queryByTestId(`project-card-${initialProject.id}`)
      ).not.toBeInTheDocument();
    });
  });
});
