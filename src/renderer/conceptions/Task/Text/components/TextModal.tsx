import { ReactNode, memo, useActionState, useCallback, useMemo } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Popup } from "@composites/Popup";
import {
  useTextModalOpenSelector,
  useTextContentValueSelector,
  useSetTextContentDispatch,
} from "../context";
import { useTextModalActions } from "../hooks";
import type { TTextModalProps } from "./types";
import { createId } from "@utils/generation";
import { clamp } from "@utils/markdownContent";

const Fields = memo(
  ({
    contentValue,
    controlPanel,
    showPositionField,
    defaultPosition,
    maxPosition,
  }: {
    contentValue?: TMarkdownContent;
    controlPanel?: ReactNode;
    showPositionField?: boolean;
    defaultPosition?: number;
    maxPosition?: number;
  }) => {
    return (
      <Stack spacing={1}>
        {Boolean(controlPanel) && controlPanel}
        {showPositionField && (
          <TextField
            type="number"
            name="position"
            id="text-modal-position"
            label="Position"
            placeholder="Enter a position"
            defaultValue={defaultPosition}
            slotProps={{
              htmlInput: { min: 1, max: maxPosition },
            }}
            fullWidth
          />
        )}
        <TextField
          name="text"
          id="text-modal-textarea"
          label="Text"
          placeholder="Add supporting details"
          autoFocus
          fullWidth
          multiline
          rows={4}
          defaultValue={contentValue?.content ?? ""}
          autoComplete="off"
        />
      </Stack>
    );
  }
);

export const TextModal = memo(
  ({ onSuccess, onUpdate, contents, controlPanel }: TTextModalProps) => {
    const isOpen = useTextModalOpenSelector();
    const contentValue = useTextContentValueSelector();

    const { closeModal } = useTextModalActions();
    const setContent = useSetTextContentDispatch();

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const position = useMemo(() => getNextPosition(contents), [contents]);
    const maxCreatePosition = useMemo(() => {
      return Math.max(contents.length + 1, 1);
    }, [contents.length]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          const rawText = formData.get("text");
          const isEditing = Boolean(contentValue);

          const textValue = typeof rawText === "string" ? rawText.trim() : "";

          if (textValue === "") {
            return undefined;
          }

          const rawPosition = formData.get("position");
          const parsedPosition =
            typeof rawPosition === "string" ? parseInt(rawPosition, 10) : NaN;

          const createPosition =
            !isEditing && !Number.isNaN(parsedPosition)
              ? clamp(parsedPosition - 1, 0, contents.length)
              : position;

          const content: TMarkdownContent = {
            id: contentValue?.id ?? createId(),
            type: "text",
            content: textValue,
            position: contentValue?.position ?? createPosition,
          };

          if (isEditing && onUpdate) {
            onUpdate(content);
          } else {
            onSuccess(content);
          }

          handleClose();

          return undefined;
        },
        [
          position,
          handleClose,
          onSuccess,
          onUpdate,
          contentValue,
          contents.length,
        ]
      ),
      undefined
    );

    const modalTitle = contentValue ? "Edit text" : "Add text";
    const confirmLabel = contentValue ? "Save Text" : "Add Text";
    const confirmPendingLabel = contentValue ? "Saving..." : "Adding...";

    return (
      <Popup
        title={modalTitle}
        description="Add a paragraph of text to this task."
        isOpen={isOpen}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel={confirmLabel}
        confirmPendingLabel={confirmPendingLabel}
        formTestId="text-modal-form"
        messageTestId="text-modal-message"
        content={
          <Fields
            contentValue={contentValue}
            controlPanel={controlPanel}
            showPositionField={!contentValue}
            defaultPosition={maxCreatePosition}
            maxPosition={maxCreatePosition}
          />
        }
      />
    );
  }
);

TextModal.displayName = "TextModal";

function getNextPosition(contents: TMarkdownContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}
