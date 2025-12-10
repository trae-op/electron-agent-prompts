export type TCreateProjectModalProps = {
  onSuccess: (data: TProject) => void;
};

export type TCreateProjectFormProps = {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  handleClose: () => void;
};
