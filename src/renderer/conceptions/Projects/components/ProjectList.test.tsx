import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProjectList } from "./ProjectList";
import type { TProjectListItemProps } from "./types";

const renderProjectListItem = vi.fn((props: TProjectListItemProps) => props);

vi.mock("./ProjectListItem", () => ({
  ProjectListItem: (props: TProjectListItemProps) => {
    renderProjectListItem(props);

    return (
      <div data-testid={`stub-project-item-${props.project.id}`}>
        {props.project.name}
      </div>
    );
  },
}));

const createProject = (id: string, created: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date(created),
  updated: new Date("2024-01-01T00:00:00.000Z"),
  countTasks: 0,
});

describe("ProjectList", () => {
  beforeEach(() => {
    renderProjectListItem.mockClear();
  });

  it("renders projects sorted by updated date with dividers applied except the last item", () => {
    const projects = [
      createProject("delta", "2024-02-01T00:00:00.000Z"),
      createProject("alpha", "2024-04-01T00:00:00.000Z"),
      createProject("charlie", "2024-03-01T00:00:00.000Z"),
    ];
    const onOpen = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <ProjectList
        projects={projects}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByTestId("projects-list")).toBeInTheDocument();
    expect(renderProjectListItem).toHaveBeenCalledTimes(projects.length);

    const invocationOrder = renderProjectListItem.mock.calls.map((call) => {
      const [props] = call as [TProjectListItemProps];
      return props.project.id;
    });
    expect(invocationOrder).toEqual(["alpha", "charlie", "delta"]);

    renderProjectListItem.mock.calls.forEach((call, index) => {
      const [props] = call as [TProjectListItemProps];
      expect(props.onOpen).toBe(onOpen);
      expect(props.onEdit).toBe(onEdit);
      expect(props.onDelete).toBe(onDelete);
      const shouldHaveDivider = index < projects.length - 1;
      expect(props.divider).toBe(shouldHaveDivider);
    });
  });
});
