import { ReactNode, useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  Provider,
  useSetDeleteProjectModalOpenDispatch,
  useSetDeleteProjectModalProjectDispatch,
} from "../context";
import { DeleteProjectModal } from "./DeleteProjectModal";

const createProject = (id: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-01-02T00:00:00.000Z"),
  countTasks: 1,
});

type ContextInitializerProps = {
  children: ReactNode;
  project?: TProject;
  isOpen?: boolean;
};

const ContextInitializer = ({
  children,
  project,
  isOpen,
}: ContextInitializerProps) => {
  const setOpen = useSetDeleteProjectModalOpenDispatch();
  const setProject = useSetDeleteProjectModalProjectDispatch();

  useEffect(() => {
    setProject(project);
  }, [project, setProject]);

  useEffect(() => {
    setOpen(isOpen ?? false);
  }, [isOpen, setOpen]);

  return children;
};

type RenderOptions = {
  project?: TProject;
  isOpen?: boolean;
};

type RenderResult = ReturnType<typeof render> & {
  onSuccess: ReturnType<typeof vi.fn>;
  user: ReturnType<typeof userEvent.setup>;
  rerenderWithOptions: (options: RenderOptions) => void;
};

const renderModal = ({ project, isOpen }: RenderOptions): RenderResult => {
  const user = userEvent.setup();
  const onSuccess = vi.fn();

  const rendered = render(
    <Provider>
      <ContextInitializer project={project} isOpen={isOpen}>
        <DeleteProjectModal onSuccess={onSuccess} />
      </ContextInitializer>
    </Provider>
  );

  const rerenderWithOptions = (options: RenderOptions) => {
    rendered.rerender(
      <Provider>
        <ContextInitializer project={options.project} isOpen={options.isOpen}>
          <DeleteProjectModal onSuccess={onSuccess} />
        </ContextInitializer>
      </Provider>
    );
  };

  return { ...rendered, onSuccess, user, rerenderWithOptions };
};

describe("DeleteProjectModal", () => {
  let deleteProjectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    deleteProjectMock = vi.fn();
    if (window.electron?.invoke === undefined) {
      window.electron = { invoke: {} } as typeof window.electron;
    }
    window.electron.invoke.deleteProject = deleteProjectMock;
  });

  it("renders the confirmation message when a project is selected", async () => {
    const project = createProject("alpha");

    renderModal({ project, isOpen: true });

    const message = await screen.findByTestId("delete-project-message");
    expect(message).toHaveTextContent(
      `Are you sure you want to delete "${project.name}"?`
    );
  });

  it("does not render the form when no project is selected", () => {
    renderModal({ isOpen: true });

    expect(screen.queryByTestId("delete-project-form")).not.toBeInTheDocument();
  });

  it("closes the modal when cancel is clicked", async () => {
    const project = createProject("beta");
    const { user } = renderModal({ project, isOpen: true });

    await user.click(await screen.findByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(
        screen.queryByTestId("delete-project-form")
      ).not.toBeInTheDocument();
    });
  });

  it("submits the deletion request and closes on success", async () => {
    const project = createProject("gamma");
    deleteProjectMock.mockResolvedValue(true);
    const { user, onSuccess } = renderModal({ project, isOpen: true });

    await user.click(
      await screen.findByRole("button", { name: "Delete Project" })
    );

    await waitFor(() => {
      expect(deleteProjectMock).toHaveBeenCalledWith({ id: project.id });
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(project.id);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId("delete-project-form")
      ).not.toBeInTheDocument();
    });
  });

  it("keeps the modal open when deletion fails", async () => {
    const project = createProject("delta");
    deleteProjectMock.mockResolvedValue(false);
    const { user, onSuccess } = renderModal({ project, isOpen: true });

    await user.click(
      await screen.findByRole("button", { name: "Delete Project" })
    );

    await waitFor(() => {
      expect(deleteProjectMock).toHaveBeenCalledWith({ id: project.id });
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(screen.getByTestId("delete-project-form")).toBeInTheDocument();
  });
});
