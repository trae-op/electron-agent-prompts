export type TListItemContent = {
  value: string;
  subitems: string[];
};

export const SUBLIST_INDENT = 2;

export function parseListContent(content: string): TListItemContent[] {
  const normalizedLines = content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\t/g, "  "))
    .filter((line) => line.trim().length > 0);

  const items: TListItemContent[] = [];
  let current: TListItemContent | undefined;

  for (const rawLine of normalizedLines) {
    const match = rawLine.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);

    if (match === null) {
      if (current !== undefined) {
        current.subitems.push(rawLine.trim());
      } else {
        current = { value: rawLine.trim(), subitems: [] };
        items.push(current);
      }
      continue;
    }

    const [, indentRaw, , text] = match;
    const indent = indentRaw.length;
    const value = text.trim();
    const isSubItem = indent >= SUBLIST_INDENT;

    if (isSubItem && current !== undefined) {
      current.subitems.push(value);
      continue;
    }

    const nextItem: TListItemContent = {
      value,
      subitems: [],
    };

    current = nextItem;
    items.push(nextItem);
  }

  return items;
}
