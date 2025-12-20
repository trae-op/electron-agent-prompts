export type TTitleModalProps = {
  onSuccess: (data: TMarkdownContent) => void;
};

export type THeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type THeadingOption = {
  value: THeadingLevel;
  label: string;
};
