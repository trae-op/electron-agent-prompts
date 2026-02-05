type TTask = {
  name: string;
  id: number;
  created: Date;
  updated: Date;
  projectId: number;
  fileId: string;
  url: string | null;
  foldersContentFiles?: string[];
  ide?: string;
  isSkills?: boolean;
  isSettings?: boolean;
  content?: string[];
};
