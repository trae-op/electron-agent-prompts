export type TAgentSkillsData = {
  name: string;
  description: string;
};

function normalizeSingleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function serializeAgentSkillsContent(data: TAgentSkillsData): string {
  const name = normalizeSingleLine(data.name);
  const description = normalizeSingleLine(data.description);

  return [`---`, `name: ${name}`, `description: ${description}`, `---`].join(
    "\n"
  );
}

export function parseAgentSkillsContent(markdown: string): TAgentSkillsData {
  const lines = markdown.split(/\r?\n/);
  const first = lines.findIndex((line) => line.trim() === "---");

  if (first === -1) {
    return { name: "", description: "" };
  }

  const second = lines.findIndex(
    (line, index) => index > first && line.trim() === "---"
  );

  if (second === -1) {
    return { name: "", description: "" };
  }

  const frontmatter = lines.slice(first + 1, second);

  const findValue = (key: "name" | "description"): string => {
    const rawLine = frontmatter.find((line) =>
      line.trim().startsWith(`${key}:`)
    );

    if (!rawLine) {
      return "";
    }

    const index = rawLine.indexOf(":");
    const value = index === -1 ? "" : rawLine.slice(index + 1);

    return value.trim();
  };

  return {
    name: findValue("name"),
    description: findValue("description"),
  };
}
