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
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

import { Popup } from "@composites/Popup";
import {
  useListModalOpenSelector,
  useListContentValueSelector,
  useSetListContentDispatch,
} from "../context";
import { useListModalActions } from "../hooks";
import type { TFieldsProps, TListItemDraft, TListModalProps } from "./types";
import { createId } from "@utils/generation";
import {
  buildListContent,
  detectListStyle,
  parseListContent,
} from "@conceptions/Task/Markdown/utils";
import type {
  TListItemContent,
  TListStyle,
} from "@conceptions/Task/Markdown/utils/types";

const createEmptyListItem = (): TListItemDraft => ({
  id: createId(),
  value: "",
  subitems: [],
});

const buildInitialItems = (
  contentValue?: TMarkdownContent
): TListItemDraft[] => {
  if (!contentValue?.content) {
    return [createEmptyListItem()];
  }

  const parsed = parseListContent(contentValue.content);

  if (parsed.length === 0) {
    return [createEmptyListItem()];
  }

  return parsed.map((item) => ({
    id: createId(),
    value: item.value,
    subitems: item.subitems.map((subitem) => ({
      id: createId(),
      value: subitem,
    })),
  }));
};

const listStyleOptions = [
  { value: "bullet", label: "Bullet" },
  { value: "numbered", label: "Numbered" },
];

const Fields = memo(
  ({
    items,
    onAddItem,
    onChangeItem,
    onRemoveItem,
    onAddSubItem,
    onChangeSubItem,
    onRemoveSubItem,
    listStyle,
    onChangeListStyle,
    controlPanel,
  }: TFieldsProps) => {
    const handleListStyleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChangeListStyle(event.target.value as TListStyle);
    };

    return (
      <Stack spacing={1}>
        <FormControl
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
          component="fieldset"
        >
          <Tooltip placement="top" arrow title="Add another item">
            <IconButton
              aria-label="add list item"
              color="primary"
              onClick={onAddItem}
              size="small"
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {Boolean(controlPanel) && controlPanel}
          <RadioGroup
            row
            name="list-style"
            value={listStyle}
            sx={{
              "& .MuiFormControlLabel-root": { mx: 0 },
            }}
            onChange={handleListStyleChange}
          >
            {listStyleOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    sx={{
                      width: 30,
                      height: 30,
                      mx: 0.5,
                    }}
                    size="small"
                  />
                }
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Stack spacing={1.25}>
          {items.map((item, index) => {
            const onChange = (
              event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => onChangeItem(index, event.target.value);

            return (
              <Stack key={item.id} spacing={0.75}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TextField
                    name="items"
                    label={`Item ${index + 1}`}
                    placeholder="Enter list item"
                    value={item.value}
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

                <Stack spacing={0.75} pl={5}>
                  {item.subitems.map((subitem, subIndex) => {
                    const handleChangeSubItem = (
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => onChangeSubItem(index, subIndex, event.target.value);

                    return (
                      <Stack
                        key={subitem.id}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <TextField
                          name="subitems"
                          label={`Subitem ${subIndex + 1}`}
                          placeholder="Enter sub item"
                          value={subitem.value}
                          onChange={handleChangeSubItem}
                          autoComplete="off"
                          fullWidth
                        />
                        <IconButton
                          aria-label="remove sub item"
                          color="inherit"
                          onClick={() => onRemoveSubItem(index, subIndex)}
                          size="small"
                          sx={{ mt: 0.5 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    );
                  })}

                  <Tooltip placement="right" arrow title="Add sub item">
                    <IconButton
                      aria-label="add sub item"
                      color="primary"
                      onClick={() => onAddSubItem(index)}
                      size="small"
                      sx={{ width: "fit-content" }}
                    >
                      <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    );
  }
);

export const ListModal = memo(
  ({ onSuccess, onUpdate, contents, controlPanel }: TListModalProps) => {
    const isOpen = useListModalOpenSelector();
    const contentValue = useListContentValueSelector();

    const { closeModal } = useListModalActions();
    const setContent = useSetListContentDispatch();

    const [items, setItems] = useState<TListItemDraft[]>(() =>
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
      setItems((prev) => [...prev, createEmptyListItem()]);
    }, []);

    const handleChangeItem = useCallback((index: number, value: string) => {
      setItems((prev) => {
        const next = [...prev];
        const target = next[index];

        if (!target) {
          return prev;
        }

        next[index] = { ...target, value };
        return next;
      });
    }, []);

    const handleRemoveItem = useCallback((index: number) => {
      setItems((prev) => {
        if (prev.length === 1) {
          return [createEmptyListItem()];
        }

        return prev.filter((_, itemIndex) => itemIndex !== index);
      });
    }, []);

    const handleAddSubItem = useCallback((parentIndex: number) => {
      setItems((prev) => {
        const next = [...prev];
        const target = next[parentIndex];

        if (!target) {
          return prev;
        }

        const updated = {
          ...target,
          subitems: [...target.subitems, { id: createId(), value: "" }],
        };

        next[parentIndex] = updated;
        return next;
      });
    }, []);

    const handleChangeSubItem = useCallback(
      (parentIndex: number, subIndex: number, value: string) => {
        setItems((prev) => {
          const next = [...prev];
          const target = next[parentIndex];

          if (!target) {
            return prev;
          }

          const subitems = [...target.subitems];
          const subTarget = subitems[subIndex];

          if (!subTarget) {
            return prev;
          }

          subitems[subIndex] = { ...subTarget, value };

          next[parentIndex] = {
            ...target,
            subitems,
          };

          return next;
        });
      },
      []
    );

    const handleRemoveSubItem = useCallback(
      (parentIndex: number, subIndex: number) => {
        setItems((prev) => {
          const next = [...prev];
          const target = next[parentIndex];

          if (!target) {
            return prev;
          }

          const subitems = target.subitems.filter(
            (_subitem, currentIndex) => currentIndex !== subIndex
          );

          next[parentIndex] = {
            ...target,
            subitems,
          };

          return next;
        });
      },
      []
    );

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const position = useMemo(() => getNextPosition(contents), [contents]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, _formData: FormData): Promise<undefined> => {
          const normalizedItems: TListItemContent[] = items
            .map((item) => {
              const value = item.value.trim();
              const subitems = item.subitems
                .map((subitem) => subitem.value.trim())
                .filter(Boolean);

              if (!value && subitems.length === 0) {
                return undefined;
              }

              if (!value) {
                return undefined;
              }

              return {
                value,
                subitems,
              };
            })
            .filter((item): item is TListItemContent => item !== undefined);

          if (normalizedItems.length === 0) {
            return undefined;
          }

          const isEditing = Boolean(contentValue);
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
        [
          items,
          contentValue,
          listStyle,
          position,
          handleClose,
          onSuccess,
          onUpdate,
        ]
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
            onAddSubItem={handleAddSubItem}
            onChangeSubItem={handleChangeSubItem}
            onRemoveSubItem={handleRemoveSubItem}
            listStyle={listStyle}
            onChangeListStyle={setListStyle}
            controlPanel={controlPanel}
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
