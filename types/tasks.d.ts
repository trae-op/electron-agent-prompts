type TTask = {
  name: string;
  id: number;
  created: Date;
  updated: Date;
  projectId: number;
  fileId: string;
  url: string | null;
  foldersContentFiles?: string[];
  content?: string[];
};

type TTaskWithFoldersContent = TTask;
