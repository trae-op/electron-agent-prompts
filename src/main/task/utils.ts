export function buildMarkdownDocument(contents: TMarkdownContent[]): string {
  return [...contents]
    .sort((a, b) => a.position - b.position)
    .map((item) => {
      if (item.type === "code") {
        const normalizedContent = item.content.replace(/\s+$/, "");
        return ["```", normalizedContent, "```"].join("\n");
      }

      return item.content;
    })
    .join("\n\n");
}
