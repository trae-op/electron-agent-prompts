import { useCallback } from "react";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import CodeIcon from "@mui/icons-material/Code";

import type { TWrapTokens } from "../types";

const isEditableElement = (
  element: Element | null
): element is HTMLInputElement | HTMLTextAreaElement => {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  );
};

const dispatchInputEvent = (
  element: HTMLInputElement | HTMLTextAreaElement
) => {
  element.dispatchEvent(new Event("input", { bubbles: true }));
};

export const TextControlPanel = () => {
  const applyTokens = useCallback((tokens: TWrapTokens) => {
    if (typeof document === "undefined") {
      return;
    }

    const activeElement = document.activeElement;

    if (!isEditableElement(activeElement)) {
      return;
    }

    if (typeof activeElement.setRangeText !== "function") {
      return;
    }

    const { selectionStart, selectionEnd, value } = activeElement;

    if (
      selectionStart === null ||
      selectionEnd === null ||
      selectionStart === selectionEnd
    ) {
      return;
    }

    const selectedText = value.slice(selectionStart, selectionEnd);
    const replacement = `${tokens.prefix}${selectedText}${tokens.suffix}`;

    activeElement.setRangeText(
      replacement,
      selectionStart,
      selectionEnd,
      "end"
    );

    const nextStart = selectionStart + tokens.prefix.length;
    const nextEnd = nextStart + selectedText.length;

    activeElement.setSelectionRange(nextStart, nextEnd);
    activeElement.focus();
    dispatchInputEvent(activeElement);
  }, []);

  const handleBold = () => {
    applyTokens({ prefix: "**", suffix: "**" });
  };

  const handleTemplate = () => {
    applyTokens({ prefix: "`", suffix: "`" });
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  return (
    <Stack direction="row" alignItems="center">
      <Tooltip placement="top" title="Bold" arrow>
        <IconButton
          aria-label="wrap selection in bold"
          color="primary"
          size="small"
          sx={{
            m: 0,
          }}
          onClick={handleBold}
          onMouseDown={handleMouseDown}
        >
          <FormatBoldIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Inline code" placement="top" arrow>
        <IconButton
          aria-label="wrap selection in inline code"
          color="primary"
          size="small"
          sx={{
            m: 0,
          }}
          onClick={handleTemplate}
          onMouseDown={(event) => event.preventDefault()}
        >
          <CodeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
