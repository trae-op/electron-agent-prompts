export type TProjectOverviewItem = {
  project: TProject;
  promptsCount: number;
  createdLabel: string;
  updatedLabel: string;
};

export type TProjectActionsHook = {
  handleCreateProject: () => void;
  handleOpenProject: (project: TProject) => void;
  handleEditProject: (project: TProject) => void;
  handleDeleteProject: (project: TProject) => void;
};
