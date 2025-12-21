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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { useContentsSelector } from "../context";
import {
  TContentActionHandlers,
  TContentBlockWrapperProps,
  THeadingVariant,
} from "./types";
import Divider from "@mui/material/Divider";

export const MarkdownContentList = ({
  onUpdate,
  onDelete,
  onMove,
}: TContentActionHandlers) => {
  const contents = useContentsSelector();

  return (
    <Stack spacing={1.5} data-testid="markdown-content-list">
      {contents.map((contentItem) => {
        const handleEdit = () => onUpdate?.(contentItem);
        const handleDelete = () => onDelete?.(contentItem);
        const handleMove = () => onMove?.(contentItem);

        return (
          <ContentBlockWrapper
            key={contentItem.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMove={handleMove}
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
  onMove,
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
          top: -28,
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
          aria-label="move content block"
          sx={{
            cursor: "move",
          }}
          onClick={onMove}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </Stack>
      {children}
    </Box>
  );
};

const TitleItem = ({ content }: { content: string }) => {
  const { headingVariant, text } = normalizeHeading(content);

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

type TTokenType =
  | "keyword"
  | "string"
  | "number"
  | "operator"
  | "comment"
  | "text";

const keywordPattern =
  /\b(const|let|var|function|return|if|else|type|interface|extends|implements|new|import|from|export|default|class|async|await|try|catch|finally|throw|switch|case|break|continue|for|while|do|of|in)\b/;

const operatorPattern = /(===|==|=>|<=|>=|&&|\|\||!=|!==|[=+\-*/%!?<>])/;

const codeTokenizer =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|===|==|=>|<=|>=|&&|\|\||!=|!==|[=+\-*/%!?<>]|\b(?:const|let|var|function|return|if|else|type|interface|extends|implements|new|import|from|export|default|class|async|await|try|catch|finally|throw|switch|case|break|continue|for|while|do|of|in)\b)/g;

function tokenizeSegments(
  text: string
): Array<{ value: string; type: TTokenType }> {
  const segments: Array<{ value: string; type: TTokenType }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(codeTokenizer)) {
    const matchText = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      segments.push({ value: text.slice(lastIndex, start), type: "text" });
    }

    segments.push({ value: matchText, type: detectType(matchText) });
    lastIndex = start + matchText.length;
  }

  if (lastIndex < text.length) {
    segments.push({ value: text.slice(lastIndex), type: "text" });
  }

  return segments;
}

function detectType(token: string): TTokenType {
  if (/^\/\//.test(token) || /^\/\*/.test(token)) return "comment";
  if (/^"/.test(token) || /^'/.test(token) || /^`/.test(token)) return "string";
  if (keywordPattern.test(token)) return "keyword";
  if (/^\d/.test(token)) return "number";
  if (operatorPattern.test(token)) return "operator";
  return "text";
}

function pickColor(type: TTokenType, theme: any): string | undefined {
  switch (type) {
    case "keyword":
      return theme.palette.primary.main;
    case "string":
      return theme.palette.success.main;
    case "number":
      return theme.palette.info.main;
    case "operator":
      return theme.palette.warning.main;
    case "comment":
      return theme.palette.text.secondary;
    default:
      return undefined;
  }
}

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

function normalizeHeading(content: string): {
  headingVariant: THeadingVariant;
  text: string;
} {
  const match = content.match(/^(#{1,6})\s+(.*)$/);
  if (!match) {
    return { headingVariant: "h2", text: content };
  }

  const [, hashes, text] = match;
  const depth = Math.min(hashes.length, 6);
  const variant = `h${depth}` as THeadingVariant;

  return { headingVariant: variant, text };
}

function splitListItems(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^(?:[-*]\s+)?/, ""));
}
