export type TProjectActionsHook = {
  handleOpenProject: (project: TProject) => void;
  handleEditProject: (project: TProject) => void;
  handleDeleteProject: (project: TProject) => void;
};
