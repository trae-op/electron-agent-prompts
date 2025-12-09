export type TProjectActionsHook = {
  handleCreateProject: () => void;
  handleOpenProject: (project: TProject) => void;
  handleEditProject: (project: TProject) => void;
  handleDeleteProject: (project: TProject) => void;
};
