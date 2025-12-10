import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";

vi.mock("@hooks/dayjs", () => ({
  __esModule: true,
  useDayjs: vi.fn(),
}));

import { useDayjs } from "@hooks/dayjs";
import { ProjectCard } from "./ProjectCard";

const createProject = (overrides?: Partial<TProject>): TProject => ({
  id: "project-1",
  name: "Alpha Project",
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-02-02T00:00:00.000Z"),
  countTasks: 3,
  ...overrides,
});

describe("ProjectCard", () => {
  const mockedUseDayjs = vi.mocked(useDayjs);

  beforeEach(() => {
    mockedUseDayjs.mockReset();
    mockedUseDayjs.mockReturnValue(dayjs);
  });

  it("renders project details and handles interactions", () => {
    const project = createProject();
    const onOpen = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <ProjectCard
        project={project}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText(project.name)).toBeInTheDocument();
    expect(screen.getByText("Created: Jan 1, 2024")).toBeInTheDocument();
    expect(screen.getByText("Updated: Feb 2, 2024")).toBeInTheDocument();
    expect(screen.getByText("3 Prompts")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(`project-card-area-${project.id}`));
    expect(onOpen).toHaveBeenCalledWith(project);

    fireEvent.click(screen.getByTestId(`project-edit-${project.id}`));
    expect(onEdit).toHaveBeenCalledWith(project);

    fireEvent.click(screen.getByTestId(`project-delete-${project.id}`));
    expect(onDelete).toHaveBeenCalledWith(project);
  });

  it("uses singular label for a single prompt", () => {
    const project = createProject({ id: "project-2", countTasks: 1 });

    render(
      <ProjectCard
        project={project}
        onOpen={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("1 Prompt")).toBeInTheDocument();
  });

  it("returns null when the dayjs instance is not ready", () => {
    mockedUseDayjs.mockReturnValueOnce(undefined);

    const { container } = render(
      <ProjectCard
        project={createProject()}
        onOpen={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
