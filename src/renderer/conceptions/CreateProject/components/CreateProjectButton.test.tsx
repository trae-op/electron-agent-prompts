import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Provider,
  useCreateProjectModalOpenSelector,
  useLatestCreatedProjectSelector,
  useSetLatestCreatedProjectDispatch,
} from "../context";
import { CreateProjectButton } from "./CreateProjectButton";

const createProject = (id: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-01-02T00:00:00.000Z"),
  countTasks: 1,
});

const ModalStateProbe = () => {
  const isOpen = useCreateProjectModalOpenSelector();
  return <span data-testid="create-project-modal-open">{String(isOpen)}</span>;
};

const LatestProjectProbe = () => {
  const latest = useLatestCreatedProjectSelector();
  return (
    <span data-testid="create-project-latest">{latest?.id ?? "none"}</span>
  );
};

const InitializeLatestProject = ({ project }: { project: TProject }) => {
  const setLatest = useSetLatestCreatedProjectDispatch();

  useEffect(() => {
    setLatest(project);
  }, [project, setLatest]);

  return null;
};

describe("CreateProjectButton", () => {
  it("opens the modal and resets the latest project", async () => {
    const project = createProject("alpha");

    render(
      <Provider>
        <InitializeLatestProject project={project} />
        <CreateProjectButton />
        <ModalStateProbe />
        <LatestProjectProbe />
      </Provider>
    );

    expect(screen.getByTestId("create-project-modal-open")).toHaveTextContent(
      "false"
    );
    expect(screen.getByTestId("create-project-latest")).toHaveTextContent(
      project.id
    );

    await userEvent.click(screen.getByTestId("create-project-button"));

    expect(screen.getByTestId("create-project-modal-open")).toHaveTextContent(
      "true"
    );
    expect(screen.getByTestId("create-project-latest")).toHaveTextContent(
      "none"
    );
  });
});
