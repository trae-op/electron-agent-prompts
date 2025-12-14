import { ReactNode, useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Provider,
  useSetUpdateProjectModalProjectDispatch,
  useUpdateProjectModalProjectSelector,
} from "../context";
import { UpdateProjectModal } from "./UpdateProjectModal";

const createProject = (
  id: string,
  overrides?: Partial<TProject>
): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-01-02T00:00:00.000Z"),
  countTasks: 1,
  ...overrides,
});

const OpenModalWithProjectOnMount = ({
  project,
  children,
}: {
  project: TProject;
  children: ReactNode;
}) => {
  const setProject = useSetUpdateProjectModalProjectDispatch();

  useEffect(() => {
    setProject(project);
  }, [project, setProject]);

  return <>{children}</>;
};

const ModalStateProbe = () => {
  const project = useUpdateProjectModalProjectSelector();
  const isOpen = project !== undefined;
  return <span data-testid="update-project-modal-state">{String(isOpen)}</span>;
};

const ProjectProbe = () => {
  const project = useUpdateProjectModalProjectSelector();
  return (
    <span data-testid="update-project-modal-project">
      {project?.id ?? "none"}
    </span>
  );
};

describe("UpdateProjectModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render the form when closed", () => {
    render(
      <Provider>
        <UpdateProjectModal onSuccess={vi.fn()} />
      </Provider>
    );

    expect(screen.queryByTestId("update-project-form")).toBeNull();
  });

  it("renders the form once a project is selected and the modal is opened", async () => {
    const project = createProject("alpha");

    render(
      <Provider>
        <OpenModalWithProjectOnMount project={project}>
          <UpdateProjectModal onSuccess={vi.fn()} />
        </OpenModalWithProjectOnMount>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("update-project-form")).toBeInTheDocument();
    });
  });

  it("submits updates, calls the ipc method, and closes on success", async () => {
    const initialProject = createProject("beta", { name: "Initial" });
    const updatedProject = createProject("beta", { name: "Updated" });
    const onSuccess = vi.fn();
    const updateProjectMock = vi.mocked(window.electron.invoke.updateProject);
    updateProjectMock.mockResolvedValue(updatedProject);

    render(
      <Provider>
        <OpenModalWithProjectOnMount project={initialProject}>
          <UpdateProjectModal onSuccess={onSuccess} />
        </OpenModalWithProjectOnMount>
        <ModalStateProbe />
        <ProjectProbe />
      </Provider>
    );

    const form = await screen.findByTestId("update-project-form");
    const nameField = within(
      screen.getByTestId("update-project-name")
    ).getByRole("textbox");

    await userEvent.clear(nameField);
    await userEvent.type(nameField, "  Updated Name  ");
    await userEvent.click(
      within(form).getByRole("button", { name: "Save Changes" })
    );

    await waitFor(() => {
      expect(updateProjectMock).toHaveBeenCalledWith({
        id: initialProject.id,
        name: "Updated Name",
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(updatedProject);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("update-project-form")).toBeNull();
      expect(
        screen.getByTestId("update-project-modal-state")
      ).toHaveTextContent("false");
      expect(
        screen.getByTestId("update-project-modal-project")
      ).toHaveTextContent("none");
    });
  });

  it("keeps the modal open when the update returns undefined", async () => {
    const project = createProject("gamma", { name: "Old" });
    const onSuccess = vi.fn();
    const updateProjectMock = vi.mocked(window.electron.invoke.updateProject);
    updateProjectMock.mockResolvedValue(undefined);

    render(
      <Provider>
        <OpenModalWithProjectOnMount project={project}>
          <UpdateProjectModal onSuccess={onSuccess} />
        </OpenModalWithProjectOnMount>
      </Provider>
    );

    const form = await screen.findByTestId("update-project-form");
    const nameField = within(
      screen.getByTestId("update-project-name")
    ).getByRole("textbox");

    await userEvent.clear(nameField);
    await userEvent.type(nameField, "New Name");
    await userEvent.click(
      within(form).getByRole("button", { name: "Save Changes" })
    );

    await waitFor(() => {
      expect(updateProjectMock).toHaveBeenCalledWith({
        id: project.id,
        name: "New Name",
      });
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(
      await screen.findByTestId("update-project-form")
    ).toBeInTheDocument();
  });

  it("closes the modal when cancel is clicked", async () => {
    const project = createProject("delta");

    render(
      <Provider>
        <OpenModalWithProjectOnMount project={project}>
          <UpdateProjectModal onSuccess={vi.fn()} />
        </OpenModalWithProjectOnMount>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("update-project-form")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByTestId("update-project-form")).toBeNull();
    });
  });
});
