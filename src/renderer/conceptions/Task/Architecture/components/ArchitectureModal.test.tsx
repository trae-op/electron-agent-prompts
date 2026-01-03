import { ReactNode, useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Provider,
  useArchitectureContentValueSelector,
  useArchitectureModalOpenSelector,
  useSetArchitectureContentDispatch,
  useSetArchitectureModalOpenDispatch,
} from "../context";
import { ArchitectureModal } from "./ArchitectureModal";

const OpenModalOnMount = ({ children }: { children: ReactNode }) => {
  const setOpen = useSetArchitectureModalOpenDispatch();

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
  const setOpen = useSetArchitectureModalOpenDispatch();
  const setContent = useSetArchitectureContentDispatch();

  useEffect(() => {
    setContent(content);
    setOpen(true);
  }, [content, setContent, setOpen]);

  return <>{children}</>;
};

const ModalStateProbe = () => {
  const isOpen = useArchitectureModalOpenSelector();
  return <span data-testid="architecture-modal-state">{String(isOpen)}</span>;
};

const ContentIdProbe = () => {
  const content = useArchitectureContentValueSelector();
  return (
    <span data-testid="architecture-modal-content-id">
      {content?.id ?? "none"}
    </span>
  );
};

describe("ArchitectureModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render the form when the modal is closed", () => {
    render(
      <Provider>
        <ArchitectureModal contents={[]} onSuccess={vi.fn()} />
      </Provider>
    );

    expect(screen.queryByTestId("architecture-modal-form")).toBeNull();
  });

  it("renders the form when the modal is opened", async () => {
    render(
      <Provider>
        <OpenModalOnMount>
          <ArchitectureModal contents={[]} onSuccess={vi.fn()} />
        </OpenModalOnMount>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("architecture-modal-form")).toBeInTheDocument();
    });
  });

  it("submits a new architecture, calls onSuccess, and closes the modal", async () => {
    const contents: TMarkdownContent[] = [
      { id: "alpha", type: "text", content: "one", position: 1 },
      { id: "beta", type: "code", content: "two", position: 4 },
    ];
    const onSuccess = vi.fn();

    render(
      <Provider>
        <OpenModalOnMount>
          <ArchitectureModal contents={contents} onSuccess={onSuccess} />
        </OpenModalOnMount>
        <ModalStateProbe />
        <ContentIdProbe />
      </Provider>
    );

    const form = await screen.findByTestId("architecture-modal-form");

    fireEvent.change(within(form).getByPlaceholderText("src/"), {
      target: { value: " src " },
    });

    let itemInputs = within(form).getAllByPlaceholderText(
      "Enter folder or file"
    );

    fireEvent.change(itemInputs[0], {
      target: { value: " components " },
    });

    fireEvent.click(screen.getByRole("button", { name: "add nested item" }));

    itemInputs = within(form).getAllByPlaceholderText("Enter folder or file");

    fireEvent.change(itemInputs[1], {
      target: { value: " Button.tsx " },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "add architecture item" })
    );

    itemInputs = within(form).getAllByPlaceholderText("Enter folder or file");

    fireEvent.change(itemInputs[2], {
      target: { value: "index.ts" },
    });

    fireEvent.click(
      within(form).getByRole("button", { name: "Add Architecture" })
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    const payload = onSuccess.mock.calls[0][0] as TMarkdownContent;

    expect(payload.type).toBe("architecture");
    expect(payload.id).toEqual(expect.any(String));
    expect(payload.position).toBe(5);
    expect(payload.content).toBe(
      ["src/", "├── components", "│   └── Button.tsx", "└── index.ts"].join(
        "\n"
      )
    );

    await waitFor(() => {
      expect(screen.queryByTestId("architecture-modal-form")).toBeNull();
      expect(screen.getByTestId("architecture-modal-state")).toHaveTextContent(
        "false"
      );
      expect(
        screen.getByTestId("architecture-modal-content-id")
      ).toHaveTextContent("none");
    });
  }, 10000);

  it("updates an existing architecture via onUpdate while preserving id and position", async () => {
    const existingContent: TMarkdownContent = {
      id: "arch-1",
      type: "architecture",
      content: [
        "src/",
        "├── components",
        "│   └── Button.tsx",
        "└── index.ts",
      ].join("\n"),
      position: 2,
    };
    const onUpdate = vi.fn();

    render(
      <Provider>
        <OpenModalWithContentOnMount content={existingContent}>
          <ArchitectureModal
            contents={[existingContent]}
            onSuccess={vi.fn()}
            onUpdate={onUpdate}
          />
        </OpenModalWithContentOnMount>
        <ModalStateProbe />
        <ContentIdProbe />
      </Provider>
    );

    const form = await screen.findByTestId("architecture-modal-form");

    fireEvent.change(within(form).getByPlaceholderText("src/"), {
      target: { value: "  app  " },
    });

    let itemInputs = within(form).getAllByPlaceholderText(
      "Enter folder or file"
    );

    fireEvent.change(itemInputs[0], {
      target: { value: "ui" },
    });

    fireEvent.change(itemInputs[1], {
      target: { value: "Button.jsx" },
    });

    fireEvent.change(itemInputs[2], {
      target: { value: "index.tsx" },
    });

    fireEvent.click(
      within(form).getByRole("button", { name: "Save Architecture" })
    );

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    const payload = onUpdate.mock.calls[0][0] as TMarkdownContent;

    expect(payload.id).toBe(existingContent.id);
    expect(payload.position).toBe(existingContent.position);
    expect(payload.type).toBe("architecture");
    expect(payload.content).toBe(
      ["app/", "├── ui", "│   └── Button.jsx", "└── index.tsx"].join("\n")
    );

    await waitFor(() => {
      expect(screen.queryByTestId("architecture-modal-form")).toBeNull();
      expect(screen.getByTestId("architecture-modal-state")).toHaveTextContent(
        "false"
      );
      expect(
        screen.getByTestId("architecture-modal-content-id")
      ).toHaveTextContent("none");
    });
  });

  it("keeps the modal open when submission produces no architecture content", async () => {
    const onSuccess = vi.fn();

    render(
      <Provider>
        <OpenModalOnMount>
          <ArchitectureModal contents={[]} onSuccess={onSuccess} />
        </OpenModalOnMount>
      </Provider>
    );

    const form = await screen.findByTestId("architecture-modal-form");

    await userEvent.click(
      within(form).getByRole("button", { name: "Add Architecture" })
    );

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
    });

    expect(screen.getByTestId("architecture-modal-form")).toBeInTheDocument();
  });
});
