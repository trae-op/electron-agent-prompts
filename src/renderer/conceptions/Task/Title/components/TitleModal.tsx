import { ReactNode, memo, useActionState, useCallback, useMemo } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import { Popup } from "@composites/Popup";
import {
  useTitleModalOpenSelector,
  useContentValueSelector,
  useSetContentDispatch,
} from "../context";
import { useTitleModalActions } from "../hooks";
import type { THeadingLevel, THeadingOption, TTitleModalProps } from "./types";
import { createId } from "@utils/generation";
import { clamp } from "@utils/markdownContent";

const defaultHeadingLevel: THeadingLevel = "h2";

const headingOptions: THeadingOption[] = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
];

export const Fields = memo(
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
    const selectedHeadingLevel = useMemo<THeadingLevel>(() => {
      if (!contentValue?.content) {
        return defaultHeadingLevel;
      }

      const match = contentValue.content.match(/^(#{1,6})\s+/);
      if (!match) {
        return defaultHeadingLevel;
      }

      const depth = Math.min(match[1].length, 6);
      const candidate = `h${depth}` as THeadingLevel;

      return headingOptions.some((option) => option.value === candidate)
        ? candidate
        : defaultHeadingLevel;
    }, [contentValue]);

    return (
      <Stack spacing={1}>
        {Boolean(controlPanel) && controlPanel}
        {showPositionField && (
          <TextField
            type="number"
            name="position"
            id="title-modal-position"
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
          name="title"
          id="title-modal-title"
          label="Title"
          placeholder="My section title"
          autoFocus
          fullWidth
          defaultValue={
            contentValue?.content.replace(/^#+\s*/, "").trim() ?? ""
          }
          autoComplete="off"
        />
        <FormControl component="fieldset">
          <RadioGroup row name="heading" defaultValue={selectedHeadingLevel}>
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
      </Stack>
    );
  }
);

export const TitleModal = memo(
  ({ onSuccess, onUpdate, contents, controlPanel }: TTitleModalProps) => {
    const isOpen = useTitleModalOpenSelector();
    const contentValue = useContentValueSelector();

    const { closeModal } = useTitleModalActions();
    const setContent = useSetContentDispatch();

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
          const rawTitle = formData.get("title");
          const rawHeading = formData.get("heading");
          const isEditing = Boolean(contentValue);

          const nextTitle = typeof rawTitle === "string" ? rawTitle.trim() : "";
          const selectedHeading = isHeadingLevel(rawHeading)
            ? rawHeading
            : defaultHeadingLevel;

          if (nextTitle === "") {
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
            type: "title",
            content: buildHeadingContent(nextTitle, selectedHeading),
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

TitleModal.displayName = "TitleModal";

function isHeadingLevel(value: unknown): value is THeadingLevel {
  return typeof value === "string" && /^h[1-6]$/.test(value);
}

function buildHeadingContent(title: string, level: THeadingLevel): string {
  const levelNumber = Number(level.slice(1));
  const prefix = "#".repeat(Number.isFinite(levelNumber) ? levelNumber : 1);

  return `${prefix} ${title}`;
}

function getNextPosition(contents: TMarkdownContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}
