type TEventPayloadInvoke = {
  getVersion: string;
  createProject: TProject | undefined;
  updateProject: TProject | undefined;
  deleteProject: boolean;
  createTask: TTask | undefined;
  updateTask: TTask | undefined;
  deleteTask: boolean;
};

type TEventSendInvoke = {
  getVersion: string;
  createProject: {
    name: string;
  };
  updateProject: {
    id: string;
    name: string;
  };
  deleteProject: {
    id: string;
  };
  createTask: {
    name: string;
    projectId: string;
    fileId?: string;
    url?: string | null;
  };
  updateTask: {
    id: number;
    name: string;
    projectId?: number;
    fileId?: string;
    url?: string | null;
  };
  deleteTask: {
    id: number;
  };
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
};
