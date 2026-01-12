import { memo, useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useContentsSelector } from "@conceptions/Task/Markdown";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

type MarkdownContentListButtonsProps = {
  containerRef: RefObject<HTMLElement | null>;
};

const MarkdownContentListButtons = memo(
  ({ containerRef }: MarkdownContentListButtonsProps) => {
    const [isAtTop, setIsAtTop] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [padding, setPadding] = useState(false);
    const { id: taskId } = useParams<{
      id?: string;
    }>();

    const contents = useContentsSelector();
    const checkScrollBounds = useCallback(() => {
      const container = containerRef.current;
      if (!container) {
        setIsAtTop(true);
        setIsAtBottom(true);
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsAtTop(scrollTop <= 0);
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
    }, []);

    const handleScrollTop = useCallback(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      container.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    const handleScrollBottom = useCallback(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      container.scrollTo({ top: container.scrollHeight, behavior: "instant" });
    }, []);

    const handleApply = useCallback(async () => {
      if (!taskId) return;
      setPadding(true);
      await window.electron.invoke.markdownContent({
        taskId,
        contents,
      });
      setPadding(false);
    }, [contents, taskId]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) {
        return undefined;
      }

      container.addEventListener("scroll", checkScrollBounds, {
        passive: true,
      });
      return () => {
        container.removeEventListener("scroll", checkScrollBounds);
      };
    }, []);

    return (
      <Box
        sx={{
          ml: "auto",
          alignItems: "center",
          display: "flex",
          gap: 1,
        }}
      >
        <Tooltip title="Total Content" enterDelay={200} arrow placement="top">
          <Typography sx={{ px: 2 }} component="span" variant="body2">
            {contents.length}
          </Typography>
        </Tooltip>
        <Tooltip title="Scroll to top" arrow placement="top">
          <span>
            <IconButton
              onClick={handleScrollTop}
              disabled={isAtTop}
              size="small"
            >
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Scroll to bottom" arrow placement="top">
          <span>
            <IconButton
              onClick={handleScrollBottom}
              disabled={isAtBottom}
              size="small"
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleApply}
          disabled={padding}
          loading={padding}
          data-testid="save-button"
        >
          Save
        </Button>
      </Box>
    );
  }
);

MarkdownContentListButtons.displayName = "MarkdownContentListButtons";

export default MarkdownContentListButtons;
