import { memo, useActionState, useCallback, useMemo } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Popup } from "@composites/Popup";
import {
  usePositionModalOpenSelector,
  usePositionContentValueSelector,
  useSetPositionContentDispatch,
} from "../context";
import { usePositionModalActions } from "../hooks";
import type { TPositionModalProps } from "./types";

export const PositionModal = memo(
  ({ contents, onReorder }: TPositionModalProps) => {
    const isOpen = usePositionModalOpenSelector();
    const contentValue = usePositionContentValueSelector();

    const { closeModal } = usePositionModalActions();
    const setContent = useSetPositionContentDispatch();

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const currentIndex = useMemo(
      () => contents.findIndex(({ id }) => id === contentValue?.id),
      [contents, contentValue?.id]
    );

    const maxPosition = useMemo(
      () => Math.max(contents.length, 1),
      [contents.length]
    );

    const defaultPosition = useMemo(() => {
      if (currentIndex >= 0) return currentIndex + 1;
      if (contentValue?.position !== undefined)
        return contentValue.position + 1;
      return contents.length || 1;
    }, [contentValue?.position, contents.length, currentIndex]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          if (!contentValue || contents.length === 0) {
            handleClose();
            return undefined;
          }

          const rawPosition = formData.get("position");
          const parsedPosition =
            typeof rawPosition === "string" ? parseInt(rawPosition, 10) : NaN;

          if (Number.isNaN(parsedPosition)) {
            return undefined;
          }

          const targetIndex = clamp(parsedPosition - 1, 0, contents.length - 1);
          const sourceIndex = contents.findIndex(
            ({ id }) => id === contentValue.id
          );

          if (sourceIndex === -1) {
            handleClose();
            return undefined;
          }

          if (sourceIndex === targetIndex) {
            handleClose();
            return undefined;
          }

          const next = [...contents];
          const [moved] = next.splice(sourceIndex, 1);
          next.splice(targetIndex, 0, moved);

          const reindexed = next.map((item, index) => ({
            ...item,
            position: index,
          }));

          onReorder(reindexed);
          handleClose();

          return undefined;
        },
        [contentValue, contents, handleClose, onReorder]
      ),
      undefined
    );

    return (
      <Popup
        title="Change position"
        description="Move this block to a specific position in the list."
        isOpen={isOpen}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel="Update position"
        confirmPendingLabel="Updating..."
        formTestId="position-modal-form"
        messageTestId="position-modal-message"
        content={
          <Stack spacing={1}>
            <TextField
              type="number"
              name="position"
              id="position-modal-input"
              label="Target position"
              placeholder="Enter a position"
              defaultValue={defaultPosition}
              inputProps={{
                min: 1,
                max: maxPosition,
              }}
              fullWidth
              autoFocus
            />
          </Stack>
        }
      />
    );
  }
);

PositionModal.displayName = "PositionModal";

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
