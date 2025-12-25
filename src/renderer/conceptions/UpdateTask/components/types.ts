export type TUpdateTaskModalProps = {
  onSuccess: (data: TTask) => void;
};

export type TUpdateTaskFormProps = {
  task: TTask;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  handleClose: () => void;
};

export type TFieldsProps = {
  folders: string[];
  onFoldersChange: (folders: string[]) => void;
  onFoldersTouch: () => void;
};

export type TFoldersInputProps = {
  folders: string[];
  onChange: (folders: string[]) => void;
  onTouch: () => void;
};
