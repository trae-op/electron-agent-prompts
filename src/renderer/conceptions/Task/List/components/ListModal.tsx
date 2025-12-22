import {
  ChangeEvent,
  memo,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

import { Popup } from "@composites/Popup";
import {
  useListModalOpenSelector,
  useListContentValueSelector,
  useSetListContentDispatch,
} from "../context";
import { useListModalActions } from "../hooks";
import type { TListModalProps } from "./types";
import { createId } from "@utils/generation";
import {
  buildListContent,
  detectListStyle,
  splitListItems,
} from "@conceptions/Task/Markdown/utils";
import type { TListStyle } from "@conceptions/Task/Markdown/utils/types";

const buildInitialItems = (contentValue?: TMarkdownContent): string[] => {
  if (!contentValue?.content) {
    return [""];
  }

  const items = splitListItems(contentValue.content);
  return items.length ? items : [""];
};

const Fields = memo(
  ({
    items,
    onAddItem,
    onChangeItem,
    onRemoveItem,
    listStyle,
    onChangeListStyle,
  }: {
    items: string[];
    onAddItem: () => void;
    onChangeItem: (index: number, value: string) => void;
    onRemoveItem: (index: number) => void;
    listStyle: TListStyle;
    onChangeListStyle: (value: TListStyle) => void;
  }) => {
    const handleListStyleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChangeListStyle(event.target.value as TListStyle);
    };

    return (
      <Stack spacing={1.75}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography component="h3" variant="subtitle1" fontWeight={600}>
            List items
          </Typography>
          <Tooltip title="Add another item">
            <IconButton
              aria-label="add list item"
              color="primary"
              onClick={onAddItem}
              size="small"
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <FormControl component="fieldset">
          <FormLabel component="legend">List style</FormLabel>
          <RadioGroup
            row
            name="list-style"
            value={listStyle}
            onChange={handleListStyleChange}
          >
            <FormControlLabel
              value="bullet"
              control={<Radio size="small" />}
              label="Bulleted"
            />
            <FormControlLabel
              value="numbered"
              control={<Radio size="small" />}
              label="Numbered"
            />
          </RadioGroup>
        </FormControl>
        <Stack spacing={1.25}>
          {items.map((value, index) => {
            const onChange = (
              event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => onChangeItem(index, event.target.value);

            return (
              <Stack
                key={`list-item-${index}`}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <TextField
                  name="items"
                  label={`Item ${index + 1}`}
                  placeholder="Enter list item"
                  value={value}
                  onChange={onChange}
                  autoComplete="off"
                  autoFocus={index === 0}
                  fullWidth
                />
                <IconButton
                  aria-label="remove list item"
                  color="inherit"
                  onClick={() => onRemoveItem(index)}
                  size="small"
                  sx={{ mt: 0.5 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    );
  }
);

export const ListModal = memo(
  ({ onSuccess, onUpdate, contents }: TListModalProps) => {
    const isOpen = useListModalOpenSelector();
    const contentValue = useListContentValueSelector();

    const { closeModal } = useListModalActions();
    const setContent = useSetListContentDispatch();

    const [items, setItems] = useState<string[]>(() =>
      buildInitialItems(contentValue)
    );
    const [listStyle, setListStyle] = useState<TListStyle>(() =>
      detectListStyle(contentValue?.content)
    );

    useEffect(() => {
      setItems(buildInitialItems(contentValue));
      setListStyle(detectListStyle(contentValue?.content));
    }, [contentValue]);

    const handleAddItem = useCallback(() => {
      setItems((prev) => [...prev, ""]);
    }, []);

    const handleChangeItem = useCallback((index: number, value: string) => {
      setItems((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    }, []);

    const handleRemoveItem = useCallback((index: number) => {
      setItems((prev) => {
        if (prev.length === 1) {
          return [""];
        }

        return prev.filter((_, itemIndex) => itemIndex !== index);
      });
    }, []);

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const position = useMemo(() => getNextPosition(contents), [contents]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          const rawItems = formData.getAll("items");
          const normalizedItems = rawItems
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean);
          const isEditing = Boolean(contentValue);

          if (normalizedItems.length === 0) {
            return undefined;
          }

          const content: TMarkdownContent = {
            id: contentValue?.id ?? createId(),
            type: "list",
            content: buildListContent(normalizedItems, listStyle),
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
        [position, handleClose, onSuccess, onUpdate, contentValue, listStyle]
      ),
      undefined
    );

    const modalTitle = contentValue ? "Edit list" : "Add list";
    const confirmLabel = contentValue ? "Save List" : "Add List";
    const confirmPendingLabel = contentValue ? "Saving..." : "Adding...";

    return (
      <Popup
        title={modalTitle}
        description="Add one or more bullet points for this task section."
        isOpen={isOpen}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel={confirmLabel}
        confirmPendingLabel={confirmPendingLabel}
        formTestId="list-modal-form"
        messageTestId="list-modal-message"
        content={
          <Fields
            items={items}
            onAddItem={handleAddItem}
            onChangeItem={handleChangeItem}
            onRemoveItem={handleRemoveItem}
            listStyle={listStyle}
            onChangeListStyle={setListStyle}
          />
        }
      />
    );
  }
);

ListModal.displayName = "ListModal";

function getNextPosition(contents: TMarkdownContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}
