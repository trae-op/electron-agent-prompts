type TTypesMarkdownContent =
  | "text"
  | "code"
  | "list"
  | "title"
  | "architecture";

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
