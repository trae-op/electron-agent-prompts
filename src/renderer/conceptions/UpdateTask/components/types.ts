export type TUpdateTaskModalProps = {
  onSuccess: (data: TTask) => void;
};

export type TUpdateTaskActionArgs = {
  task: TTask;
  onSuccess: (data: TTask) => void;
  setUpdateTask: (task: TTask | undefined) => void;
};
