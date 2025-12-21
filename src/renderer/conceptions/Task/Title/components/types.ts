export type TTitleModalProps = {
  contents: TMarkdownContent[];
  onSuccess: (data: TMarkdownContent) => void;
  onUpdate?: (data: TMarkdownContent) => void;
};

export type THeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type THeadingOption = {
  value: THeadingLevel;
  label: string;
};
