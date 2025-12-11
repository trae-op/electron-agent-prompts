import { ReactNode, createElement } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Provider,
  useSetUpdateProjectModalOpenDispatch,
  useSetUpdateProjectModalProjectDispatch,
  useUpdateProjectModalOpenSelector,
  useUpdateProjectModalProjectSelector,
} from "../context";
import { useUpdateProjectModalActions } from "./useUpdateProjectModalActions";

const createProject = (id: string): TProject => ({
  id,
  name: `Project ${id}`,
  created: new Date("2024-01-01T00:00:00.000Z"),
  updated: new Date("2024-01-02T00:00:00.000Z"),
  countTasks: 1,
});

const wrapper = ({ children }: { children: ReactNode }) => {
  return createElement(Provider, undefined, children);
};

describe("useUpdateProjectModalActions", () => {
  it("opens the modal for the provided project", () => {
    const { result } = renderHook(
      () => {
        const actions = useUpdateProjectModalActions();
        const project = useUpdateProjectModalProjectSelector();
        const isOpen = useUpdateProjectModalOpenSelector();
        const setProject = useSetUpdateProjectModalProjectDispatch();
        return { actions, project, isOpen, setProject };
      },
      { wrapper }
    );

    const previousProject = createProject("alpha");

    act(() => {
      result.current.setProject(previousProject);
    });

    expect(result.current.project).toEqual(previousProject);
    expect(result.current.isOpen).toBe(false);

    const updatedProject = createProject("beta");

    act(() => {
      result.current.actions.openModal(updatedProject);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.project).toEqual(updatedProject);
  });

  it("closes the modal and clears the selected project", () => {
    const { result } = renderHook(
      () => {
        const actions = useUpdateProjectModalActions();
        const project = useUpdateProjectModalProjectSelector();
        const isOpen = useUpdateProjectModalOpenSelector();
        const setOpen = useSetUpdateProjectModalOpenDispatch();
        const setProject = useSetUpdateProjectModalProjectDispatch();
        return { actions, project, isOpen, setOpen, setProject };
      },
      { wrapper }
    );

    const activeProject = createProject("gamma");

    act(() => {
      result.current.setProject(activeProject);
      result.current.setOpen(true);
    });

    expect(result.current.project).toEqual(activeProject);
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.actions.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.project).toBeUndefined();
  });
});
