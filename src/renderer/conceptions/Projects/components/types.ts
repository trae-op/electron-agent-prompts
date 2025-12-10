import { ReactNode } from "react";

export type TProjectsGridProps = {
  projects: TProject[];
  onOpen: (project: TProject) => void;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
};

export type TProjectCardProps = {
  project: TProject;
  onOpen: (project: TProject) => void;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
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
  countTasks: number;
  onEdit: (project: TProject) => void;
  onDelete: (project: TProject) => void;
};
