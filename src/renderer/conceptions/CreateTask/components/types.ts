export type TCreateTaskModalProps = {
  onSuccess: (data: TTask) => void;
};

export type TCreateTaskFormProps = {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  handleClose: () => void;
};

export type TFieldsProps = {
  folders: string[];
  onFoldersChange: (folders: string[]) => void;
};
