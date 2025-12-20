import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { useContentsSelector } from "../context";

type THeadingVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const MarkdownContentList = () => {
  const contents = useContentsSelector();

  return (
    <Stack spacing={1.5} data-testid="markdown-content-list">
      {contents.map((contentItem) => (
        <ContentItem key={contentItem.id} content={contentItem} />
      ))}
    </Stack>
  );
};

const ContentItem = ({ content }: { content: TMarkdownContent }) => {
  switch (content.type) {
    case "title":
      return <TitleItem content={content.content} />;
    case "code":
      return <CodeItem content={content.content} />;
    case "list":
      return <ListItemBlock content={content.content} />;
    case "edit":
      return <ParagraphItem content={content.content} />;
    default:
      return <ParagraphItem content={content.content} />;
  }
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
        {content}
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
