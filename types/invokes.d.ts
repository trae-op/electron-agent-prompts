type TEventPayloadInvoke = {
  getVersion: string;
  createProject: TProject | undefined;
  updateProject: TProject | undefined;
  deleteProject: boolean;
  createTask: TTask | undefined;
  updateTask: TTask | undefined;
  deleteTask: boolean;
  uploadFile: undefined;
  uploadConnectionInstructionFile: undefined;
  markdownContent: TTask | undefined;
  selectFolders: string[];
};

type TEventSendInvoke = {
  getVersion: string;
  createProject: {
    name: string;
    isGeneral?: boolean;
  };
  updateProject: {
    id: string;
    name: string;
    isGeneral?: boolean;
  };
  deleteProject: {
    id: string;
  };
  createTask: {
    name: string;
    projectId: string;
    folderPaths?: string[];
    ide?: string;
  };
  updateTask: {
    id: number;
    name: string;
    projectId?: number;
    fileId?: string;
    url?: string | null;
    folderPaths?: string[];
    ide?: string;
  };
  deleteTask: {
    id: number;
  };
  uploadFile: {
    file: Blob;
    path?: string;
  };
  markdownContent: {
    taskId: string;
    contents: TMarkdownContent[];
  };
  selectFolders: undefined;
};

type TInvoke = {
  getVersion: () => Promise<TEventSendInvoke["getVersion"]>;
  createProject: (
    payload: TEventSendInvoke["createProject"]
  ) => Promise<TEventPayloadInvoke["createProject"]>;
  updateProject: (
    payload: TEventSendInvoke["updateProject"]
  ) => Promise<TEventPayloadInvoke["updateProject"]>;
  deleteProject: (
    payload: TEventSendInvoke["deleteProject"]
  ) => Promise<TEventPayloadInvoke["deleteProject"]>;
  createTask: (
    payload: TEventSendInvoke["createTask"]
  ) => Promise<TEventPayloadInvoke["createTask"]>;
  updateTask: (
    payload: TEventSendInvoke["updateTask"]
  ) => Promise<TEventPayloadInvoke["updateTask"]>;
  deleteTask: (
    payload: TEventSendInvoke["deleteTask"]
  ) => Promise<TEventPayloadInvoke["deleteTask"]>;
  uploadFile: (
    payload: TEventSendInvoke["uploadFile"]
  ) => Promise<TEventPayloadInvoke["uploadFile"]>;
  markdownContent: (
    payload: TEventSendInvoke["markdownContent"]
  ) => Promise<TEventPayloadInvoke["markdownContent"]>;
  selectFolders: () => Promise<TEventPayloadInvoke["selectFolders"]>;
  resolveFilePath: (file: File) => string | undefined;
};
