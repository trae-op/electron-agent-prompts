import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import { useContentsSelector } from "@conceptions/Task/Markdown";

export const MarkdownContentListButtons = () => {
  const [padding, setPadding] = useState(false);
  const { id: taskId } = useParams<{
    id?: string;
  }>();

  const contents = useContentsSelector();
  const handleApply = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!taskId) return;
      const type = event.currentTarget.getAttribute("data-type");
      if (type !== "save" && type !== "send") return;
      setPadding(true);
      await window.electron.invoke.markdownContent({
        taskId,
        type,
        contents,
      });
      setPadding(false);
    },
    [contents, taskId]
  );

  return (
    <>
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        data-type="save"
        onClick={handleApply}
        disabled={padding}
        data-testid="save-button"
        fullWidth
      >
        Save
      </Button>
      <Button
        loading={padding}
        variant="contained"
        startIcon={<SendIcon />}
        data-type="send"
        disabled={padding}
        onClick={handleApply}
        loadingPosition="end"
        data-testid="send-button"
        fullWidth
      >
        Send
      </Button>
    </>
  );
};

MarkdownContentListButtons.displayName = "MarkdownContentListButtons";
