import type { TProjectOverviewItem } from "../hooks";

export type TProjectsGridProps = {
  projects: TProjectOverviewItem[];
  onOpen: (project: TProject) => void;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
};

export type TProjectCardProps = {
  item: TProjectOverviewItem;
  onOpen: (project: TProject) => void;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
};

export type TProjectsEmptyStateProps = {
  onCreateProject: () => void;
};
