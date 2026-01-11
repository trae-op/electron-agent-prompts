import { memo, useActionState, useCallback, useMemo } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Popup } from "@composites/Popup";
import {
  useAgentSkillsContentValueSelector,
  useAgentSkillsModalOpenSelector,
  useSetAgentSkillsContentDispatch,
} from "../context";
import { useAgentSkillsModalActions } from "../hooks";
import type { TAgentSkillsModalProps } from "./types";
import { createId } from "@utils/generation";
import { parseAgentSkillsContent, serializeAgentSkillsContent } from "../utils";

const Fields = memo(({ contentValue }: { contentValue?: TMarkdownContent }) => {
  const parsed = useMemo(() => {
    if (!contentValue) {
      return { name: "", description: "" };
    }

    return parseAgentSkillsContent(contentValue.content);
  }, [contentValue]);

  return (
    <Stack spacing={1}>
      <TextField
        name="name"
        id="agent-skills-name"
        label="Skill name"
        placeholder="e.g. Planning"
        autoFocus
        fullWidth
        defaultValue={parsed.name}
        autoComplete="off"
      />
      <TextField
        name="description"
        id="agent-skills-description"
        label="Description"
        placeholder="Describe what this skill covers"
        fullWidth
        multiline
        minRows={4}
        defaultValue={parsed.description}
        autoComplete="off"
      />
    </Stack>
  );
});

export const AgentSkillsModal = memo(
  ({ onSuccess, onUpdate, contents }: TAgentSkillsModalProps) => {
    const isOpen = useAgentSkillsModalOpenSelector();
    const contentValue = useAgentSkillsContentValueSelector();

    const { closeModal } = useAgentSkillsModalActions();
    const setContent = useSetAgentSkillsContentDispatch();

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const position = useMemo(() => getNextPosition(contents), [contents]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          const rawName = formData.get("name");
          const rawDescription = formData.get("description");
          const isEditing = Boolean(contentValue);

          const nameValue = typeof rawName === "string" ? rawName.trim() : "";
          const descriptionValue =
            typeof rawDescription === "string" ? rawDescription.trim() : "";

          if (nameValue === "") {
            return undefined;
          }

          const markdown = serializeAgentSkillsContent({
            name: nameValue,
            description: descriptionValue,
          });

          const content: TMarkdownContent = {
            id: contentValue?.id ?? createId(),
            type: "agent-skills",
            content: markdown,
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
        [contentValue, handleClose, onSuccess, onUpdate, position]
      ),
      undefined
    );

    const modalTitle = contentValue ? "Edit agent skill" : "Add agent skill";
    const confirmLabel = contentValue ? "Save Skill" : "Add Skill";
    const confirmPendingLabel = contentValue ? "Saving..." : "Adding...";

    return (
      <Popup
        title={modalTitle}
        description="Add an agent skill block to this task."
        isOpen={isOpen}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel={confirmLabel}
        confirmPendingLabel={confirmPendingLabel}
        formTestId="agent-skills-modal-form"
        messageTestId="agent-skills-modal-message"
        content={<Fields contentValue={contentValue} />}
      />
    );
  }
);

AgentSkillsModal.displayName = "AgentSkillsModal";

function getNextPosition(contents: TMarkdownContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}
