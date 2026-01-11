export const parseFoldersFromFormData = (formData: FormData): string[] => {
  const rawFolders = formData.get("folders");

  if (typeof rawFolders !== "string" || rawFolders.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawFolders) as unknown;
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
    ) {
      return parsed;
    }
  } catch {}

  return [];
};
