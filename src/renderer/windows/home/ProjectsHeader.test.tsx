import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";

const useProjectsSelectorMock = vi.fn();

const { CreateProjectButtonMock } = vi.hoisted(() => ({
  CreateProjectButtonMock: vi.fn(() => (
    <div data-testid="create-project-button" />
  )),
}));

vi.mock("@conceptions/Projects", () => ({
  useProjectsSelector: () => useProjectsSelectorMock(),
}));

vi.mock("@conceptions/CreateProject", () => ({
  CreateProjectButton: CreateProjectButtonMock,
}));

import { ProjectsHeader } from "./ProjectsHeader";

describe("ProjectsHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders project count in subtitle", () => {
    useProjectsSelectorMock.mockReturnValue([
      { id: "1" } as TProject,
      { id: "2" } as TProject,
    ]);

    render(<ProjectsHeader />);

    expect(screen.getByTestId("projects-header")).toBeInTheDocument();
    expect(screen.getByTestId("projects-title")).toHaveTextContent(
      "My Projects"
    );
    expect(
      screen.getByText("Manage your agent prompt projects - 2")
    ).toBeInTheDocument();
  });

  it("renders create project button", () => {
    useProjectsSelectorMock.mockReturnValue([]);

    render(<ProjectsHeader />);

    expect(screen.getByTestId("create-project-button")).toBeInTheDocument();
    expect(CreateProjectButtonMock).toHaveBeenCalledTimes(1);
  });
});
