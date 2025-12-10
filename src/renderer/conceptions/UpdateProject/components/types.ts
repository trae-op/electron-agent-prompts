export type TUpdateProjectModalProps = {
  onSuccess: (data: TProject) => void;
};

export type TUpdateProjectFormProps = {
  project: TProject;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  handleClose: () => void;
};
