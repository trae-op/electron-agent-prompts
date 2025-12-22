type TTypesMarkdownContent = "text" | "code" | "list" | "title";

type TMarkdownContent = {
  type: TTypesMarkdownContent;
  content: string;
  id: string;
  position: number;
};

type TMarkdownUploadResponse = {
  url?: string | null;
  fileId?: string;
};
