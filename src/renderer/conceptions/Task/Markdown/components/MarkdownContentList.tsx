import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useContentsSelector } from "../context";
import {
  TContentActionHandlers,
  TContentBlockWrapperProps,
  THeadingVariant,
} from "./types";
import Divider from "@mui/material/Divider";
import {
  normalizeHeading,
  pickColor,
  splitListItems,
  tokenizeSegments,
} from "../utils";

export const MarkdownContentList = ({
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: TContentActionHandlers) => {
  const contents = useContentsSelector();

  return (
    <Stack spacing={1.5} data-testid="markdown-content-list">
      {contents.map((contentItem, index) => {
        const isFirst = index === 0;
        const isLast = index === contents.length - 1;
        const handleEdit = () => onUpdate?.(contentItem);
        const handleDelete = () => onDelete?.(contentItem);
        const handleMoveUp = () => onMoveUp?.(contentItem);
        const handleMoveDown = () => onMoveDown?.(contentItem);

        return (
          <ContentBlockWrapper
            key={contentItem.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            disableMoveUp={isFirst}
            disableMoveDown={isLast}
          >
            {renderContent(contentItem)}
          </ContentBlockWrapper>
        );
      })}
    </Stack>
  );
};

function renderContent(contentItem: TMarkdownContent) {
  switch (contentItem.type) {
    case "title":
      return <TitleItem content={contentItem.content} />;
    case "code":
      return <CodeItem content={contentItem.content} />;
    case "list":
      return <ListItemBlock content={contentItem.content} />;
    case "text":
    default:
      return <ParagraphItem content={contentItem.content} />;
  }
}

const ContentBlockWrapper = ({
  children,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  disableMoveUp,
  disableMoveDown,
}: TContentBlockWrapperProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        px: 1,
        py: 0.75,
        borderRadius: 1,
        border: "1px solid transparent",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: (theme) => theme.palette.primary.main,
          boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
          ".content-block__controls": {
            opacity: 1,
            visibility: "visible",
            transform: "translateY(-2px)",
            pointerEvents: "auto",
          },
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        className="content-block__controls"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          px: 1,
          py: 0.5,
          bgcolor: (theme) => theme.palette.background.paper,
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          boxShadow: 1,
          opacity: 0,
          visibility: "hidden",
          transform: "translateY(0)",
          transition:
            "opacity 0.15s ease, visibility 0.15s ease, transform 0.15s ease",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <IconButton
          size="small"
          color="primary"
          aria-label="edit content block"
          onClick={onEdit}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          aria-label="delete content block"
          onClick={onDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <IconButton
          size="small"
          color="primary"
          disableRipple
          aria-label="move content block up"
          onClick={onMoveUp}
          disabled={disableMoveUp}
        >
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="primary"
          disableRipple
          aria-label="move content block down"
          onClick={onMoveDown}
          disabled={disableMoveDown}
        >
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>
      </Stack>
      {children}
    </Box>
  );
};

const TitleItem = ({ content }: { content: string }) => {
  const { headingVariant, text } = normalizeHeading<THeadingVariant>(content);

  return (
    <Typography
      component={headingVariant}
      variant={headingVariant}
      fontWeight={700}
    >
      {text}
    </Typography>
  );
};

const ParagraphItem = ({ content }: { content: string }) => {
  return (
    <Typography variant="body1" color="text.primary">
      {content}
    </Typography>
  );
};

const CodeItem = ({ content }: { content: string }) => {
  const segments = tokenizeSegments(content);

  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[50],
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          fontFamily:
            "Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace",
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {segments.map((segment, index) => (
          <Box
            component="span"
            key={`${segment.value}-${index}`}
            sx={(theme) => ({ color: pickColor(segment.type, theme) })}
          >
            {segment.value}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

const ListItemBlock = ({ content }: { content: string }) => {
  const items = splitListItems(content);

  return (
    <Paper variant="outlined">
      <List dense disablePadding>
        {items.map((item, index) => (
          <ListItem key={`${item}-${index}`} sx={{ py: 0.5, px: 2 }}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
