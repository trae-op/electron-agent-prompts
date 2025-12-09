type TEventPayloadInvoke = {
  getVersion: string;
  createProject: boolean | undefined;
};

type TEventSendInvoke = {
  getVersion: string;
  createProject: {
    name: string;
  };
};

type TInvoke = {
  getVersion: () => Promise<TEventSendInvoke["getVersion"]>;
  createProject: (
    payload: TEventSendInvoke["createProject"]
  ) => Promise<TEventPayloadInvoke["createProject"]>;
};
