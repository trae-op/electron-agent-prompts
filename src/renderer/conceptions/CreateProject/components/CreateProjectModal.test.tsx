import { ReactNode, useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Provider,
  useCreateProjectModalOpenSelector,
  useSetCreateProjectModalOpenDispatch,
} from "../context";
import { CreateProjectModal } from "./CreateProjectModal";

const OpenModalOnMount = ({ children }: { children: ReactNode }) => {
  const setOpen = useSetCreateProjectModalOpenDispatch();

  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  return <>{children}</>;
};

const ModalStateProbe = () => {
  const isOpen = useCreateProjectModalOpenSelector();
  return <span data-testid="create-project-modal-state">{String(isOpen)}</span>;
};

describe("CreateProjectModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render the form when the modal is closed", () => {
    render(
      <Provider>
        <CreateProjectModal onSuccess={vi.fn()} />
      </Provider>
    );

    expect(screen.queryByTestId("create-project-form")).toBeNull();
  });

  it("renders the form when the modal is opened", async () => {
    render(
      <Provider>
        <OpenModalOnMount>
          <CreateProjectModal onSuccess={vi.fn()} />
        </OpenModalOnMount>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("create-project-form")).toBeInTheDocument();
    });
  });

  it("submits the form, calls the ipc method, and closes on success", async () => {
    const project: TProject = {
      id: "created-1",
      name: "Created Project",
      created: new Date("2024-01-01T00:00:00.000Z"),
      updated: new Date("2024-01-01T00:00:00.000Z"),
      countTasks: 0,
    };
    const onSuccess = vi.fn();
    const createProjectMock = vi.mocked(window.electron.invoke.createProject);
    createProjectMock.mockResolvedValue(project);

    render(
      <Provider>
        <OpenModalOnMount>
          <CreateProjectModal onSuccess={onSuccess} />
        </OpenModalOnMount>
        <ModalStateProbe />
      </Provider>
    );

    const form = await screen.findByTestId("create-project-form");
    const nameField = within(
      screen.getByTestId("create-project-name")
    ).getByRole("textbox");

    await userEvent.type(nameField, "  New Project  ");
    await userEvent.click(
      within(form).getByRole("button", { name: "Create Project" })
    );

    await waitFor(() => {
      expect(window.electron.invoke.createProject).toHaveBeenCalledWith({
        name: "New Project",
      });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(project);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("create-project-form")).toBeNull();
      expect(
        screen.getByTestId("create-project-modal-state")
      ).toHaveTextContent("false");
    });
  });

  it("closes the modal when cancel is clicked", async () => {
    render(
      <Provider>
        <OpenModalOnMount>
          <CreateProjectModal onSuccess={vi.fn()} />
        </OpenModalOnMount>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("create-project-form")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByTestId("create-project-form")).toBeNull();
    });
  });
});
