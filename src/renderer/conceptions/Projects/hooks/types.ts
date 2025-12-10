export type TProjectActionsHook = {
  handleOpenProject: (project: TProject) => void;
  handleDeleteProject: (project: TProject) => void;
};
