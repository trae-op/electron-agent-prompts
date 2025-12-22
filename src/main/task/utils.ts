export function buildMarkdownDocument(contents: TMarkdownContent[]): string {
  return [...contents]
    .sort((a, b) => a.position - b.position)
    .map((item) => item.content)
    .join("\n\n");
}
