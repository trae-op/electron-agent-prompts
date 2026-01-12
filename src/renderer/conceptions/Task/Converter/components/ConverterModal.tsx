import { memo, useActionState, useCallback } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Popup } from "@composites/Popup";
import { useConverterModalOpenSelector } from "../context";
import { useConverterModalActions } from "../hooks";
import { convertMarkdownToContents } from "../utils";
import { useSetContentsDispatch } from "@conceptions/Task/Markdown";
import type { TConverterModalProps } from "./types";

export const ConverterModal = memo((_props: TConverterModalProps) => {
  const isOpen = useConverterModalOpenSelector();
  const { closeModal } = useConverterModalActions();
  const setContents = useSetContentsDispatch();
  const handleClose = useCallback(() => {
    closeModal();
  }, []);

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        const rawMarkdown = formData.get("markdown");
        const nextValue =
          typeof rawMarkdown === "string" ? rawMarkdown.trim() : "";

        if (nextValue === "") {
          return undefined;
        }

        const parsedContents = convertMarkdownToContents(nextValue);

        if (parsedContents.length > 0) {
          setContents(parsedContents);
        }

        handleClose();

        return undefined;
      },
      []
    ),
    undefined
  );

  return (
    <Popup
      title="Convert markdown"
      description="Paste markdown to populate the task content blocks. Code fences, headings, and lists are parsed into their matching UI blocks."
      isOpen={isOpen}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Convert"
      confirmPendingLabel="Converting..."
      formTestId="converter-modal-form"
      messageTestId="converter-modal-message"
      content={
        <Stack spacing={1.25}>
          <TextField
            name="markdown"
            id="converter-modal-textarea"
            label="Markdown"
            placeholder={`# Section\n\n- Bullet item\n- Another bullet\n\n\`\`\`js\nconst example = true;\n\`\`\``}
            autoFocus
            fullWidth
            multiline
            rows={7.7}
            autoComplete="off"
          />
        </Stack>
      }
    />
  );
});

ConverterModal.displayName = "ConverterModal";
