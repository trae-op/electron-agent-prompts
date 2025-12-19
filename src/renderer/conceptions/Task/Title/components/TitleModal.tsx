import { memo, useActionState, useCallback, useMemo } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import { Popup } from "@composites/Popup";
import { useContentsSelector } from "@conceptions/Task/Markdown";
import { useTitleModalOpenSelector } from "../context";
import { useTitleModalActions } from "../hooks";
import type { TContent } from "../../Markdown/context/types";
import type { THeadingLevel, THeadingOption, TTitleModalProps } from "./types";
import { createId } from "@utils/generation";

const defaultHeadingLevel: THeadingLevel = "h2";

const headingOptions: THeadingOption[] = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
];

export const HeadingLevel = () => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Heading level</FormLabel>
      <RadioGroup row name="heading" defaultValue={defaultHeadingLevel}>
        {headingOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export const TitleModal = memo(({ onSuccess }: TTitleModalProps) => {
  const isOpen = useTitleModalOpenSelector();
  const { closeModal } = useTitleModalActions();
  const contents = useContentsSelector();

  const handleClose = useCallback(() => {
    closeModal();
  }, []);

  const position = useMemo(() => getNextPosition(contents), [contents]);

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        const rawTitle = formData.get("title");
        const rawHeading = formData.get("heading");

        const nextTitle = typeof rawTitle === "string" ? rawTitle.trim() : "";
        const selectedHeading = isHeadingLevel(rawHeading)
          ? rawHeading
          : defaultHeadingLevel;

        if (nextTitle === "") {
          return undefined;
        }

        const content: TContent = {
          id: createId(),
          type: "title",
          content: buildHeadingContent(nextTitle, selectedHeading),
          position,
        };

        onSuccess(content);
        handleClose();

        return undefined;
      },
      [position, handleClose, onSuccess]
    ),
    undefined
  );

  return (
    <Popup
      title="Add title"
      description="Choose the heading level and text to insert a markdown title."
      isOpen={isOpen}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Add Title"
      confirmPendingLabel="Adding..."
      formTestId="title-modal-form"
      messageTestId="title-modal-message"
      content={
        <Stack spacing={2.5}>
          <TextField
            name="title"
            id="title-modal-title"
            label="Title"
            placeholder="My section title"
            autoFocus
            fullWidth
            autoComplete="off"
          />
          <HeadingLevel />
        </Stack>
      }
    />
  );
});

TitleModal.displayName = "TitleModal";

function isHeadingLevel(value: unknown): value is THeadingLevel {
  return typeof value === "string" && /^h[1-6]$/.test(value);
}

function buildHeadingContent(title: string, level: THeadingLevel): string {
  const levelNumber = Number(level.slice(1));
  const prefix = "#".repeat(Number.isFinite(levelNumber) ? levelNumber : 1);

  return `${prefix} ${title}`;
}

function getNextPosition(contents: TContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}
