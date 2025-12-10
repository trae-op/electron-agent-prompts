import { ReactNode, createElement } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Provider,
  useCreateProjectModalOpenSelector,
  useLatestCreatedProjectSelector,
  useSetCreateProjectModalOpenDispatch,
  useSetLatestCreatedProjectDispatch,
} from "../context";
import { useCreateProjectModalActions } from "./useCreateProjectModalActions";

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

describe("useCreateProjectModalActions", () => {
  it("opens the modal and clears the latest project", () => {
    const { result } = renderHook(
      () => {
        const actions = useCreateProjectModalActions();
        const isOpen = useCreateProjectModalOpenSelector();
        const latest = useLatestCreatedProjectSelector();
        const setLatest = useSetLatestCreatedProjectDispatch();
        return { actions, isOpen, latest, setLatest };
      },
      { wrapper }
    );

    const project = createProject("alpha");

    act(() => {
      result.current.setLatest(project);
    });
    expect(result.current.latest).toEqual(project);
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.actions.openModal();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.latest).toBeUndefined();
  });

  it("closes the modal and clears the latest project", () => {
    const { result } = renderHook(
      () => {
        const actions = useCreateProjectModalActions();
        const isOpen = useCreateProjectModalOpenSelector();
        const latest = useLatestCreatedProjectSelector();
        const setLatest = useSetLatestCreatedProjectDispatch();
        const setOpen = useSetCreateProjectModalOpenDispatch();
        return { actions, isOpen, latest, setLatest, setOpen };
      },
      { wrapper }
    );

    const project = createProject("beta");

    act(() => {
      result.current.setOpen(true);
      result.current.setLatest(project);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.latest).toEqual(project);

    act(() => {
      result.current.actions.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.latest).toBeUndefined();
  });
});
