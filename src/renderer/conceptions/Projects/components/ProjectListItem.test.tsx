import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProjectListItem } from "./ProjectListItem";

const useDayjsMock = vi.fn();

vi.mock("@hooks/dayjs", () => ({
  useDayjs: () => useDayjsMock(),
}));

const createProject = (id: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-02-01T00:00:00.000Z"),
  countTasks: 5,
});

describe("ProjectListItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when the dayjs instance is unavailable", () => {
    const project = createProject("void");
    useDayjsMock.mockReturnValueOnce(undefined);

    render(
      <ProjectListItem
        project={project}
        onOpen={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.queryByTestId(`project-list-item-${project.id}`)).toBeNull();
  });

  it("renders project details and delegates interactions to the provided callbacks", async () => {
    const project = createProject("alpha");
    const createdLabel = "01-05-2024";
    const updatedLabel = "02-05-2024";
    const createdFormat = vi.fn(() => createdLabel);
    const updatedFormat = vi.fn(() => updatedLabel);
    const dayjsFactory = vi.fn((value: Date) => {
      if (value === project.created) {
        return { format: createdFormat };
      }

      if (value === project.updated) {
        return { format: updatedFormat };
      }

      throw new Error("Unexpected date provided to dayjs");
    });
    useDayjsMock.mockReturnValue(dayjsFactory);

    const onOpen = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <ProjectListItem
        project={project}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(dayjsFactory).toHaveBeenCalledWith(project.created);
    expect(dayjsFactory).toHaveBeenCalledWith(project.updated);
    expect(createdFormat).toHaveBeenCalledWith("MM-DD-YYYY");
    expect(updatedFormat).toHaveBeenCalledWith("MM-DD-YYYY");

    const listItem = screen.getByTestId(`project-list-item-${project.id}`);
    expect(listItem).toBeInTheDocument();
    expect(screen.getByText(project.name)).toBeInTheDocument();
    expect(screen.getByText(createdLabel)).toBeInTheDocument();
    expect(screen.getByText(updatedLabel)).toBeInTheDocument();
    expect(screen.getByText(String(project.countTasks))).toBeInTheDocument();

    await userEvent.click(
      screen.getByTestId(`project-list-item-button-${project.id}`)
    );
    expect(onOpen).toHaveBeenCalledWith(project);

    await userEvent.click(screen.getByTestId(`project-edit-${project.id}`));
    expect(onEdit).toHaveBeenCalledWith(project);
    expect(onOpen).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByTestId(`project-delete-${project.id}`));
    expect(onDelete).toHaveBeenCalledWith(project);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
