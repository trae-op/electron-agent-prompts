type TEventPayloadInvoke = {
  getVersion: string;
  createProject: TProject | undefined;
  updateProject: TProject | undefined;
  deleteProject: boolean;
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
};
