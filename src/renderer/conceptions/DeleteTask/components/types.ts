export type TDeleteTaskModalProps = {
  onSuccess: (taskId: number) => void;
};

export type TDeleteTaskFormProps = {
  task: TTask;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  handleClose: () => void;
};
