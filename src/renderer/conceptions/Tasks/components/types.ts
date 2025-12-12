export type TTaskListProps = {
  tasks: TTask[];
  onOpen: (task: TTask) => void;
  onEdit: (task: TTask) => void;
  onDelete: (task: TTask) => void;
};

export type TTaskListItemProps = {
  task: TTask;
  onOpen: (task: TTask) => void;
  onEdit: (task: TTask) => void;
  onDelete: (task: TTask) => void;
  divider?: boolean;
};
