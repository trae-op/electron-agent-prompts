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

export type TChangePositionFailureReason =
  | "empty"
  | "invalid-position"
  | "not-found"
  | "no-change";

export type TChangePositionResult<T> =
  | {
      ok: true;
      value: T[];
    }
  | {
      ok: false;
      reason: TChangePositionFailureReason;
    };

export function changePosition<T extends { id: string; position: number }>(
  items: readonly T[],
  itemId: string,
  targetPositionOneBased: number
): TChangePositionResult<T> {
  if (items.length === 0) {
    return { ok: false, reason: "empty" };
  }

  if (!Number.isFinite(targetPositionOneBased)) {
    return { ok: false, reason: "invalid-position" };
  }

  const normalizedTarget = Math.trunc(targetPositionOneBased);
  if (Number.isNaN(normalizedTarget)) {
    return { ok: false, reason: "invalid-position" };
  }

  const targetIndex = clamp(normalizedTarget - 1, 0, items.length - 1);
  const sourceIndex = items.findIndex(({ id }) => id === itemId);

  if (sourceIndex === -1) {
    return { ok: false, reason: "not-found" };
  }

  if (sourceIndex === targetIndex) {
    return { ok: false, reason: "no-change" };
  }

  const next = [...items];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);

  const reindexed = next.map((item, index) => ({
    ...item,
    position: index,
  }));

  return { ok: true, value: reindexed };
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
