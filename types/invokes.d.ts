type TEventPayloadInvoke = {
  getVersion: string;
  createProject: TProject | undefined;
  updateProject: TProject | undefined;
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
};

type TInvoke = {
  getVersion: () => Promise<TEventSendInvoke["getVersion"]>;
  createProject: (
    payload: TEventSendInvoke["createProject"]
  ) => Promise<TEventPayloadInvoke["createProject"]>;
  updateProject: (
    payload: TEventSendInvoke["updateProject"]
  ) => Promise<TEventPayloadInvoke["updateProject"]>;
};
