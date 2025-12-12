export type TProjectListProps = {
  projects: TProject[];
  onOpen: (project: TProject) => void;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
};

export type TProjectListItemProps = {
  project: TProject;
  onOpen: (project: TProject) => void;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
  divider?: boolean;
};
