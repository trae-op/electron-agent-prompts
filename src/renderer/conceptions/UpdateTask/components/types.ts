export type TUpdateTaskModalProps = {
  onSuccess: (data: TTask) => void;
};

export type TUpdateTaskFormProps = {
  task: TTask;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  handleClose: () => void;
};
