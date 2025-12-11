import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const addNewProjectMock = vi.fn();
const updateProjectMock = vi.fn();
const removeProjectMock = vi.fn();

let createProjectModalSuccess: ((project: TProject) => void) | undefined;
let updateProjectModalSuccess: ((project: TProject) => void) | undefined;
let deleteProjectModalSuccess: ((projectId: string) => void) | undefined;

const {
  ProviderMock,
  CreateProjectModalMock,
  UpdateProjectModalMock,
  DeleteProjectModalMock,
  ProjectsSubscriberMock,
  UpdateSubscriberMock,
  ProjectsHeaderMock,
  ProjectsOverviewMock,
} = vi.hoisted(() => {
  const ProviderMock = ({ children }: { children: ReactNode }) => (
    <>{children}</>
  );

  const CreateProjectModalMock = vi.fn(
    ({ onSuccess }: { onSuccess: (project: TProject) => void }) => {
      createProjectModalSuccess = onSuccess;
      return <div data-testid="create-project-modal" />;
    }
  );

  const UpdateProjectModalMock = vi.fn(
    ({ onSuccess }: { onSuccess: (project: TProject) => void }) => {
      updateProjectModalSuccess = onSuccess;
      return <div data-testid="update-project-modal" />;
    }
  );

  const DeleteProjectModalMock = vi.fn(
    ({ onSuccess }: { onSuccess: (projectId: string) => void }) => {
      deleteProjectModalSuccess = onSuccess;
      return <div data-testid="delete-project-modal" />;
    }
  );

  const ProjectsSubscriberMock = vi.fn(() => (
    <div data-testid="projects-subscriber" />
  ));

  const UpdateSubscriberMock = vi.fn(() => (
    <div data-testid="update-subscriber" />
  ));

  const ProjectsHeaderMock = vi.fn(() => <div data-testid="projects-header" />);

  const ProjectsOverviewMock = vi.fn(() => (
    <div data-testid="projects-overview" />
  ));

  return {
    ProviderMock,
    CreateProjectModalMock,
    UpdateProjectModalMock,
    DeleteProjectModalMock,
    ProjectsSubscriberMock,
    UpdateSubscriberMock,
    ProjectsHeaderMock,
    ProjectsOverviewMock,
  };
});

vi.mock("@conceptions/User", () => ({
  Provider: ProviderMock,
}));

vi.mock("@conceptions/Projects", () => ({
  Provider: ProviderMock,
  ProjectsSubscriber: ProjectsSubscriberMock,
  useAddNewProjectDispatch: () => addNewProjectMock,
  useUpdateProjectDispatch: () => updateProjectMock,
  useRemoveProjectDispatch: () => removeProjectMock,
}));

vi.mock("@conceptions/CreateProject", () => ({
  Provider: ProviderMock,
  CreateProjectModal: CreateProjectModalMock,
}));

vi.mock("@conceptions/UpdateProject", () => ({
  Provider: ProviderMock,
  UpdateProjectModal: UpdateProjectModalMock,
}));

vi.mock("@conceptions/DeleteProject", () => ({
  Provider: ProviderMock,
  DeleteProjectModal: DeleteProjectModalMock,
}));

vi.mock("@conceptions/Updater", () => ({
  Provider: ProviderMock,
  UpdateSubscriber: UpdateSubscriberMock,
}));

vi.mock("./TopPanel", () => ({
  default: () => <div data-testid="top-panel" />,
}));

vi.mock("./ProjectsHeader", () => ({
  ProjectsHeader: ProjectsHeaderMock,
}));

vi.mock("./ProjectsOverview", () => ({
  ProjectsOverview: ProjectsOverviewMock,
}));

import Home from "./Home";

describe("Home window", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createProjectModalSuccess = undefined;
    updateProjectModalSuccess = undefined;
    deleteProjectModalSuccess = undefined;
  });

  it("renders providers, subscribers, and content", async () => {
    render(<Home />);

    expect(await screen.findByTestId("top-panel")).toBeInTheDocument();
    expect(screen.getByTestId("projects-subscriber")).toBeInTheDocument();
    expect(screen.getByTestId("update-subscriber")).toBeInTheDocument();
    expect(screen.getByTestId("projects-header")).toBeInTheDocument();
    expect(screen.getByTestId("projects-overview")).toBeInTheDocument();
    expect(screen.getByTestId("create-project-modal")).toBeInTheDocument();
    expect(screen.getByTestId("update-project-modal")).toBeInTheDocument();
    expect(screen.getByTestId("delete-project-modal")).toBeInTheDocument();
  });

  it("forwards modal success callbacks to project dispatchers", () => {
    render(<Home />);

    const project: TProject = {
      id: "string",
      name: "string",
      created: new Date(),
      updated: new Date(),
      countTasks: 0,
    };

    createProjectModalSuccess?.(project);
    expect(addNewProjectMock).toHaveBeenCalledWith(project);

    updateProjectModalSuccess?.(project);
    expect(updateProjectMock).toHaveBeenCalledWith(project);

    deleteProjectModalSuccess?.(project.id);
    expect(removeProjectMock).toHaveBeenCalledWith(project.id);
  });
});
