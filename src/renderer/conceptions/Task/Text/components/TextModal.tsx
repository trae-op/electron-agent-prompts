import { memo, useActionState, useCallback, useMemo } from "react";
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

const Fields = memo(({ contentValue }: { contentValue?: TMarkdownContent }) => {
  return (
    <Stack spacing={2.5}>
      <TextField
        name="text"
        id="text-modal-textarea"
        label="Text"
        placeholder="Add supporting details"
        autoFocus
        fullWidth
        multiline
        minRows={4}
        defaultValue={contentValue?.content ?? ""}
        autoComplete="off"
      />
    </Stack>
  );
});

export const TextModal = memo(
  ({ onSuccess, onUpdate, contents }: TTextModalProps) => {
    const isOpen = useTextModalOpenSelector();
    const contentValue = useTextContentValueSelector();

    const { closeModal } = useTextModalActions();
    const setContent = useSetTextContentDispatch();

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const position = useMemo(() => getNextPosition(contents), [contents]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          const rawText = formData.get("text");
          const isEditing = Boolean(contentValue);

          const textValue = typeof rawText === "string" ? rawText.trim() : "";

          if (textValue === "") {
            return undefined;
          }

          const content: TMarkdownContent = {
            id: contentValue?.id ?? createId(),
            type: "text",
            content: textValue,
            position: contentValue?.position ?? position,
          };

          if (isEditing && onUpdate) {
            onUpdate(content);
          } else {
            onSuccess(content);
          }

          handleClose();

          return undefined;
        },
        [position, handleClose, onSuccess, onUpdate, contentValue]
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
        content={<Fields contentValue={contentValue} />}
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
