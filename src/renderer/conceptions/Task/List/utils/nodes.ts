import { createId } from "@utils/generation";
import { TListItemDraft } from "../components";
import { parseListContent } from "@utils/markdownContent";

export const createEmptyListItem = (): TListItemDraft => ({
  id: createId(),
  value: "",
  subitems: [],
});

export const buildInitialItems = (
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

export function getNextPosition(contents: TMarkdownContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}
