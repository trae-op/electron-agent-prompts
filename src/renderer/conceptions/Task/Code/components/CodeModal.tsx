import { memo, useActionState, useCallback, useMemo } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Popup } from "@composites/Popup";
import {
  useCodeModalOpenSelector,
  useCodeContentValueSelector,
  useSetCodeContentDispatch,
} from "../context";
import { useCodeModalActions } from "../hooks";
import type { TCodeModalProps } from "./types";
import { createId } from "@utils/generation";

const Fields = memo(({ contentValue }: { contentValue?: TMarkdownContent }) => {
  return (
    <Stack spacing={2.5}>
      <TextField
        name="code"
        id="code-modal-textarea"
        label="JavaScript code"
        placeholder={`const main = () => {\n  return 42;\n};`}
        autoFocus
        fullWidth
        multiline
        minRows={8}
        defaultValue={contentValue?.content ?? ""}
        autoComplete="off"
      />
    </Stack>
  );
});

export const CodeModal = memo(
  ({ onSuccess, onUpdate, contents }: TCodeModalProps) => {
    const isOpen = useCodeModalOpenSelector();
    const contentValue = useCodeContentValueSelector();

    const { closeModal } = useCodeModalActions();
    const setContent = useSetCodeContentDispatch();

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const position = useMemo(() => getNextPosition(contents), [contents]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          const rawCode = formData.get("code");
          const isEditing = Boolean(contentValue);

          const codeValue = typeof rawCode === "string" ? rawCode : "";

          if (codeValue.trim() === "") {
            return undefined;
          }

          const content: TMarkdownContent = {
            id: contentValue?.id ?? createId(),
            type: "code",
            content: codeValue,
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

    const modalTitle = contentValue ? "Edit code block" : "Add code block";
    const confirmLabel = contentValue ? "Save Code" : "Add Code";
    const confirmPendingLabel = contentValue ? "Saving..." : "Adding...";

    return (
      <Popup
        title={modalTitle}
        description="Paste or write JavaScript to store with this task."
        isOpen={isOpen}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel={confirmLabel}
        confirmPendingLabel={confirmPendingLabel}
        formTestId="code-modal-form"
        messageTestId="code-modal-message"
        content={<Fields contentValue={contentValue} />}
      />
    );
  }
);

CodeModal.displayName = "CodeModal";

function getNextPosition(contents: TMarkdownContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}
