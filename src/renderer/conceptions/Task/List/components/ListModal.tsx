import {
  ChangeEvent,
  memo,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Popup } from "@composites/Popup";
import {
  useListModalOpenSelector,
  useListContentValueSelector,
  useSetListContentDispatch,
} from "../context";
import { useListModalActions } from "../hooks";
import type {
  TFieldsProps,
  TItemTextFieldProps,
  TListItemDraft,
  TListItemProps,
  TListModalProps,
  TSubItemRowProps,
  TSubItemTextFieldProps,
} from "./types";
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

const ItemTextField = memo(
  ({
    defaultValue,
    label,
    placeholder,
    autoFocus,
    onChange,
  }: TItemTextFieldProps) => {
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(event.target.value);
      },
      [onChange]
    );

    return (
      <TextField
        name="items"
        label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={handleChange}
        autoComplete="off"
        autoFocus={autoFocus}
        fullWidth
      />
    );
  }
);

ItemTextField.displayName = "ItemTextField";

const SubItemTextField = memo(
  ({ defaultValue, label, placeholder, onChange }: TSubItemTextFieldProps) => {
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(event.target.value);
      },
      [onChange]
    );

    return (
      <TextField
        name="subitems"
        label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={handleChange}
        autoComplete="off"
        fullWidth
      />
    );
  }
);

SubItemTextField.displayName = "SubItemTextField";

const SubItemRow = memo(
  ({
    subitem,
    parentIndex,
    subIndex,
    subitemsLength,
    onChangeSubItem,
    onRemoveSubItem,
    onMoveSubItemUp,
    onMoveSubItemDown,
  }: TSubItemRowProps) => {
    const handleChange = useCallback(
      (value: string) => {
        onChangeSubItem(subitem.id, value);
      },
      [onChangeSubItem, subitem.id]
    );

    const handleMoveUp = useCallback(() => {
      onMoveSubItemUp(parentIndex, subIndex);
    }, [onMoveSubItemUp, parentIndex, subIndex]);

    const handleMoveDown = useCallback(() => {
      onMoveSubItemDown(parentIndex, subIndex);
    }, [onMoveSubItemDown, parentIndex, subIndex]);

    const handleRemove = useCallback(() => {
      onRemoveSubItem(parentIndex, subIndex);
    }, [onRemoveSubItem, parentIndex, subIndex]);

    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <SubItemTextField
          defaultValue={subitem.value}
          label={`Subitem ${subIndex + 1}`}
          placeholder="Enter sub item"
          onChange={handleChange}
        />
        <Tooltip placement="top" arrow title="Move up">
          <span>
            <IconButton
              aria-label="move subitem up"
              color="inherit"
              onClick={handleMoveUp}
              size="small"
              disabled={subIndex === 0}
              sx={{ mt: 0.5 }}
            >
              <KeyboardArrowUpIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip placement="top" arrow title="Move down">
          <span>
            <IconButton
              aria-label="move subitem down"
              color="inherit"
              onClick={handleMoveDown}
              size="small"
              disabled={subIndex === subitemsLength - 1}
              sx={{ mt: 0.5 }}
            >
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <IconButton
          aria-label="remove sub item"
          color="inherit"
          onClick={handleRemove}
          size="small"
          sx={{ mt: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    );
  }
);

SubItemRow.displayName = "SubItemRow";

const ListItem = memo(
  ({
    item,
    index,
    itemsLength,
    onChangeItem,
    onRemoveItem,
    onMoveItemUp,
    onMoveItemDown,
    onAddSubItem,
    onChangeSubItem,
    onRemoveSubItem,
    onMoveSubItemUp,
    onMoveSubItemDown,
  }: TListItemProps) => {
    const handleChange = useCallback(
      (value: string) => {
        onChangeItem(item.id, value);
      },
      [onChangeItem, item.id]
    );

    const handleMoveUp = useCallback(() => {
      onMoveItemUp(index);
    }, [onMoveItemUp, index]);

    const handleMoveDown = useCallback(() => {
      onMoveItemDown(index);
    }, [onMoveItemDown, index]);

    const handleRemove = useCallback(() => {
      onRemoveItem(index);
    }, [onRemoveItem, index]);

    const handleAddSubItem = useCallback(() => {
      onAddSubItem(index);
    }, [onAddSubItem, index]);

    return (
      <Stack spacing={0.75}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ItemTextField
            defaultValue={item.value}
            label={`Item ${index + 1}`}
            placeholder="Enter list item"
            autoFocus={index === 0}
            onChange={handleChange}
          />
          <Tooltip placement="top" arrow title="Move up">
            <span>
              <IconButton
                aria-label="move item up"
                color="inherit"
                onClick={handleMoveUp}
                size="small"
                disabled={index === 0}
                sx={{ mt: 0.5 }}
              >
                <KeyboardArrowUpIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip placement="top" arrow title="Move down">
            <span>
              <IconButton
                aria-label="move item down"
                color="inherit"
                onClick={handleMoveDown}
                size="small"
                disabled={index === itemsLength - 1}
                sx={{ mt: 0.5 }}
              >
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <IconButton
            aria-label="remove list item"
            color="inherit"
            onClick={handleRemove}
            size="small"
            sx={{ mt: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack spacing={0.75} pl={5}>
          {item.subitems.map((subitem, subIndex) => (
            <SubItemRow
              key={subitem.id}
              subitem={subitem}
              parentIndex={index}
              subIndex={subIndex}
              subitemsLength={item.subitems.length}
              onChangeSubItem={onChangeSubItem}
              onRemoveSubItem={onRemoveSubItem}
              onMoveSubItemUp={onMoveSubItemUp}
              onMoveSubItemDown={onMoveSubItemDown}
            />
          ))}

          <Tooltip placement="right" arrow title="Add sub item">
            <IconButton
              aria-label="add sub item"
              color="primary"
              onClick={handleAddSubItem}
              size="small"
              sx={{ width: "fit-content" }}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    );
  }
);

ListItem.displayName = "ListItem";

const Fields = memo(
  ({
    items,
    onAddItem,
    onChangeItem,
    onRemoveItem,
    onMoveItemUp,
    onMoveItemDown,
    onAddSubItem,
    onChangeSubItem,
    onRemoveSubItem,
    onMoveSubItemUp,
    onMoveSubItemDown,
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
            return (
              <ListItem
                key={item.id}
                item={item}
                index={index}
                itemsLength={items.length}
                onChangeItem={onChangeItem}
                onRemoveItem={onRemoveItem}
                onMoveItemUp={onMoveItemUp}
                onMoveItemDown={onMoveItemDown}
                onAddSubItem={onAddSubItem}
                onChangeSubItem={onChangeSubItem}
                onRemoveSubItem={onRemoveSubItem}
                onMoveSubItemUp={onMoveSubItemUp}
                onMoveSubItemDown={onMoveSubItemDown}
              />
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

    const itemDraftValuesRef = useRef<Map<string, string>>(new Map());
    const subitemDraftValuesRef = useRef<Map<string, string>>(new Map());

    const [items, setItems] = useState<TListItemDraft[]>(() =>
      buildInitialItems(contentValue)
    );
    const [listStyle, setListStyle] = useState<TListStyle>(() =>
      detectListStyle(contentValue?.content)
    );

    useEffect(() => {
      const nextItems = buildInitialItems(contentValue);
      setItems(nextItems);
      setListStyle(detectListStyle(contentValue?.content));

      const nextItemDraftValues = new Map<string, string>();
      const nextSubitemDraftValues = new Map<string, string>();

      for (const item of nextItems) {
        nextItemDraftValues.set(item.id, item.value);
        for (const subitem of item.subitems) {
          nextSubitemDraftValues.set(subitem.id, subitem.value);
        }
      }

      itemDraftValuesRef.current = nextItemDraftValues;
      subitemDraftValuesRef.current = nextSubitemDraftValues;
    }, [contentValue]);

    const handleAddItem = useCallback(() => {
      const nextItem = createEmptyListItem();
      itemDraftValuesRef.current.set(nextItem.id, "");
      setItems((prev) => [...prev, nextItem]);
    }, []);

    const handleChangeItem = useCallback((itemId: string, value: string) => {
      itemDraftValuesRef.current.set(itemId, value);
    }, []);

    const handleRemoveItem = useCallback((index: number) => {
      setItems((prev) => {
        if (prev.length === 1) {
          const nextItem = createEmptyListItem();
          itemDraftValuesRef.current = new Map([[nextItem.id, ""]]);
          subitemDraftValuesRef.current = new Map();
          return [nextItem];
        }

        const target = prev[index];
        if (target) {
          itemDraftValuesRef.current.delete(target.id);
          for (const subitem of target.subitems) {
            subitemDraftValuesRef.current.delete(subitem.id);
          }
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

        const newSubitem = { id: createId(), value: "" };
        subitemDraftValuesRef.current.set(newSubitem.id, "");

        const updated = {
          ...target,
          subitems: [...target.subitems, newSubitem],
        };

        next[parentIndex] = updated;
        return next;
      });
    }, []);

    const handleChangeSubItem = useCallback(
      (subitemId: string, value: string) => {
        subitemDraftValuesRef.current.set(subitemId, value);
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

          const removed = target.subitems[subIndex];
          if (removed) {
            subitemDraftValuesRef.current.delete(removed.id);
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

    const handleMoveItemUp = useCallback((index: number) => {
      if (index === 0) return;

      setItems((prev) => {
        const next = [...prev];
        const temp = next[index - 1];
        next[index - 1] = next[index];
        next[index] = temp;
        return next;
      });
    }, []);

    const handleMoveItemDown = useCallback((index: number) => {
      setItems((prev) => {
        if (index >= prev.length - 1) return prev;

        const next = [...prev];
        const temp = next[index + 1];
        next[index + 1] = next[index];
        next[index] = temp;
        return next;
      });
    }, []);

    const handleMoveSubItemUp = useCallback(
      (parentIndex: number, subIndex: number) => {
        if (subIndex === 0) return;

        setItems((prev) => {
          const next = [...prev];
          const target = next[parentIndex];

          if (!target) return prev;

          const subitems = [...target.subitems];
          const temp = subitems[subIndex - 1];
          subitems[subIndex - 1] = subitems[subIndex];
          subitems[subIndex] = temp;

          next[parentIndex] = { ...target, subitems };
          return next;
        });
      },
      []
    );

    const handleMoveSubItemDown = useCallback(
      (parentIndex: number, subIndex: number) => {
        setItems((prev) => {
          const next = [...prev];
          const target = next[parentIndex];

          if (!target || subIndex >= target.subitems.length - 1) return prev;

          const subitems = [...target.subitems];
          const temp = subitems[subIndex + 1];
          subitems[subIndex + 1] = subitems[subIndex];
          subitems[subIndex] = temp;

          next[parentIndex] = { ...target, subitems };
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
              const value = (
                itemDraftValuesRef.current.get(item.id) ?? item.value
              ).trim();
              const subitems = item.subitems
                .map((subitem) =>
                  (
                    subitemDraftValuesRef.current.get(subitem.id) ??
                    subitem.value
                  ).trim()
                )
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
            onMoveItemUp={handleMoveItemUp}
            onMoveItemDown={handleMoveItemDown}
            onAddSubItem={handleAddSubItem}
            onChangeSubItem={handleChangeSubItem}
            onRemoveSubItem={handleRemoveSubItem}
            onMoveSubItemUp={handleMoveSubItemUp}
            onMoveSubItemDown={handleMoveSubItemDown}
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
