export type TUpdateTaskModalProps = {
  onSuccess: (data: TTask) => void;
  projects: TProject[];
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
  projects: TProject[];
};
