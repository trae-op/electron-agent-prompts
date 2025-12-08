type TProjectTask = {
  id: string;
  name: string;
  created: string;
  updated: string;
  userId: string;
  projectId: string;
  url: string;
  fileId: string;
};

type TProject = {
  id: string;
  name: string;
  created: string;
  updated: string;
  userId: string;
  tasks: TProjectTask[];
};
