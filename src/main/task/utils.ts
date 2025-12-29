export function buildMarkdownDocument(contents: TMarkdownContent[]): string {
  return [...contents]
    .sort((a, b) => a.position - b.position)
    .map((item) => {
      if (item.type === "code" || item.type === "architecture") {
        const normalizedContent = item.content.replace(/\s+$/, "");
        const fence = item.type === "architecture" ? "```architecture" : "```";

        return [fence, normalizedContent, "```"].join("\n");
      }

      return item.content;
    })
    .join("\n\n");
}
