import { ChangeEvent, memo, useActionState, useCallback } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Popup } from "@composites/Popup";
import {
  useConverterMarkdownValueSelector,
  useConverterModalOpenSelector,
  useSetConverterMarkdownDispatch,
} from "../context";
import { useConverterModalActions } from "../hooks";
import { convertMarkdownToContents } from "../utils";
import { useSetContentsDispatch } from "@conceptions/Task/Markdown";
import type { TConverterModalProps } from "./types";

export const ConverterModal = memo((_props: TConverterModalProps) => {
  const isOpen = useConverterModalOpenSelector();
  const markdownValue = useConverterMarkdownValueSelector();

  const { closeModal } = useConverterModalActions();
  const setMarkdownValue = useSetConverterMarkdownDispatch();
  const setContents = useSetContentsDispatch();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMarkdownValue(event.target.value);
    },
    [setMarkdownValue]
  );

  const handleClose = useCallback(() => {
    setMarkdownValue("");
    closeModal();
  }, [closeModal, setMarkdownValue]);

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        const rawMarkdown = formData.get("markdown");
        const nextValue =
          typeof rawMarkdown === "string" ? rawMarkdown.trim() : "";

        setMarkdownValue(nextValue);

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
      [handleClose, setContents, setMarkdownValue]
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
            value={markdownValue}
            onChange={handleChange}
            autoComplete="off"
          />
        </Stack>
      }
    />
  );
});

ConverterModal.displayName = "ConverterModal";
