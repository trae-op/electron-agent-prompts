export type TDeleteProjectModalProps = {
  onSuccess: (projectId: string) => void;
};

export type TDeleteProjectFormProps = {
  project: TProject;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  handleClose: () => void;
};
