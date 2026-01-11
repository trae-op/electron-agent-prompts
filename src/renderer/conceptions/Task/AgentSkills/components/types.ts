export type TAgentSkillsModalProps = {
  contents: TMarkdownContent[];
  onSuccess: (data: TMarkdownContent) => void;
  onUpdate?: (data: TMarkdownContent) => void;
};
