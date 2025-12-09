import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectsEmptyState } from "./ProjectsEmptyState";

describe("ProjectsEmptyState", () => {
  it("renders the empty state message", () => {
    render(<ProjectsEmptyState onCreateProject={vi.fn()} />);

    const container = screen.getByTestId("projects-empty-state");
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("You do not have any projects yet");
    expect(container).toHaveTextContent(
      "Create your first project to start organizing and managing agent prompts."
    );
    expect(screen.getByTestId("projects-empty-action")).toBeInTheDocument();
  });

  it("calls onCreateProject when the action button is clicked", async () => {
    const onCreateProject = vi.fn();
    const user = userEvent.setup();

    render(<ProjectsEmptyState onCreateProject={onCreateProject} />);

    await user.click(screen.getByTestId("projects-empty-action"));

    expect(onCreateProject).toHaveBeenCalledTimes(1);
  });
});
