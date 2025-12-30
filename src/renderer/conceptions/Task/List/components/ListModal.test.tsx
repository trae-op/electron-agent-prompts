import { ReactNode, useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import {
  Provider,
  useListContentValueSelector,
  useListModalOpenSelector,
  useSetListContentDispatch,
  useSetListModalOpenDispatch,
} from "../context";
import { ListModal } from "./ListModal";

const OpenModalOnMount = ({ children }: { children: ReactNode }) => {
  const setOpen = useSetListModalOpenDispatch();

  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  return <>{children}</>;
};

const OpenModalWithContentOnMount = ({
  children,
  content,
}: {
  children: ReactNode;
  content: TMarkdownContent;
}) => {
  const setOpen = useSetListModalOpenDispatch();
  const setContent = useSetListContentDispatch();

  useEffect(() => {
    setContent(content);
    setOpen(true);
  }, [content, setContent, setOpen]);

  return <>{children}</>;
};

const ModalStateProbe = () => {
  const isOpen = useListModalOpenSelector();
  return <span data-testid="list-modal-state">{String(isOpen)}</span>;
};

const ContentIdProbe = () => {
  const content = useListContentValueSelector();
  return (
    <span data-testid="list-modal-content-id">{content?.id ?? "none"}</span>
  );
};

describe("ListModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render the form when the modal is closed", () => {
    render(
      <Provider>
        <ListModal contents={[]} onSuccess={vi.fn()} />
      </Provider>
    );

    expect(screen.queryByTestId("list-modal-form")).toBeNull();
  });

  it("renders the form when the modal is opened", async () => {
    render(
      <Provider>
        <OpenModalOnMount>
          <ListModal contents={[]} onSuccess={vi.fn()} />
        </OpenModalOnMount>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("list-modal-form")).toBeInTheDocument();
    });
  });

  it("submits a new list, calls onSuccess, and closes the modal", async () => {
    const contents: TMarkdownContent[] = [
      { id: "one", type: "text", content: "a", position: 2 },
      { id: "two", type: "code", content: "b", position: 5 },
    ];
    const onSuccess = vi.fn();

    render(
      <Provider>
        <OpenModalOnMount>
          <ListModal contents={contents} onSuccess={onSuccess} />
        </OpenModalOnMount>
        <ModalStateProbe />
        <ContentIdProbe />
      </Provider>
    );

    const form = await screen.findByTestId("list-modal-form");

    fireEvent.change(screen.getByLabelText("Item 1"), {
      target: { value: "  Project Outline  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "add sub item" }));
    fireEvent.change(screen.getByLabelText("Subitem 1"), {
      target: { value: "  Key Points  " },
    });

    fireEvent.click(screen.getByRole("button", { name: "add list item" }));
    fireEvent.change(screen.getByLabelText("Item 2"), {
      target: { value: "Second Item" },
    });

    fireEvent.click(screen.getByLabelText("Numbered"));

    fireEvent.click(within(form).getByRole("button", { name: "Add List" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    const payload = onSuccess.mock.calls[0][0] as TMarkdownContent;

    expect(payload.type).toBe("list");
    expect(payload.id).toEqual(expect.any(String));
    expect(payload.position).toBe(6);
    expect(payload.content).toBe(
      ["1. Project Outline", "  - Key Points", "2. Second Item"].join("\n")
    );

    await waitFor(() => {
      expect(screen.queryByTestId("list-modal-form")).toBeNull();
      expect(screen.getByTestId("list-modal-state")).toHaveTextContent("false");
      expect(screen.getByTestId("list-modal-content-id")).toHaveTextContent(
        "none"
      );
    });
  }, 10000);

  it("updates an existing list via onUpdate and keeps the same id and position", async () => {
    const existing: TMarkdownContent = {
      id: "list-1",
      type: "list",
      content: "- Existing item\n  - Outline",
      position: 3,
    };
    const onUpdate = vi.fn();

    render(
      <Provider>
        <OpenModalWithContentOnMount content={existing}>
          <ListModal
            contents={[existing]}
            onSuccess={vi.fn()}
            onUpdate={onUpdate}
          />
        </OpenModalWithContentOnMount>
        <ModalStateProbe />
        <ContentIdProbe />
      </Provider>
    );

    const form = await screen.findByTestId("list-modal-form");

    fireEvent.change(screen.getByLabelText("Item 1"), {
      target: { value: "Updated item" },
    });

    fireEvent.change(screen.getByLabelText("Subitem 1"), {
      target: { value: "Updated detail" },
    });

    fireEvent.click(screen.getByLabelText("Numbered"));

    fireEvent.click(within(form).getByRole("button", { name: "Save List" }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    const payload = onUpdate.mock.calls[0][0] as TMarkdownContent;

    expect(payload.id).toBe(existing.id);
    expect(payload.position).toBe(existing.position);
    expect(payload.type).toBe("list");
    expect(payload.content).toBe(
      ["1. Updated item", "  - Updated detail"].join("\n")
    );

    await waitFor(() => {
      expect(screen.queryByTestId("list-modal-form")).toBeNull();
      expect(screen.getByTestId("list-modal-state")).toHaveTextContent("false");
      expect(screen.getByTestId("list-modal-content-id")).toHaveTextContent(
        "none"
      );
    });
  });

  it("keeps the modal open when submission yields no list items", async () => {
    const onSuccess = vi.fn();

    render(
      <Provider>
        <OpenModalOnMount>
          <ListModal contents={[]} onSuccess={onSuccess} />
        </OpenModalOnMount>
      </Provider>
    );

    const form = await screen.findByTestId("list-modal-form");

    fireEvent.click(within(form).getByRole("button", { name: "Add List" }));

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
    });

    expect(screen.getByTestId("list-modal-form")).toBeInTheDocument();
  });
});
