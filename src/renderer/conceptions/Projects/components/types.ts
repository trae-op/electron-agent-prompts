import { ReactNode } from "react";
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

export type TProjectCardDetailsProps = {
  project: TProject;
  createdLabel: string;
  updatedLabel: string;
  onOpen: (project: TProject) => void;
};

export type TProjectCardMetaRowProps = {
  icon: ReactNode;
  label: string;
};

export type TProjectCardFooterProps = {
  project: TProject;
  promptsCount: number;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
};
