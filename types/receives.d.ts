type TUnsubscribeFunction = () => void;

type TEventPayloadReceive = {
  updateApp: TUpdateData;
  openUpdateApp: TOpenUpdateApp;
  auth: TAuth;
  createProject: boolean | undefined;
  user: {
    user: TUser;
  };
};

type TReceive = {
  subscribeWindowOpenUpdateApp: (
    callback: (payload: TEventPayloadReceive["openUpdateApp"]) => void
  ) => TUnsubscribeFunction;
  subscribeCreateProject: (
    callback: (payload: TEventPayloadReceive["createProject"]) => void
  ) => TUnsubscribeFunction;
  subscribeUpdateApp: (
    callback: (payload: TEventPayloadReceive["updateApp"]) => void
  ) => TUnsubscribeFunction;
  subscribeWindowAuth: (
    callback: (payload: TEventPayloadReceive["auth"]) => void
  ) => TUnsubscribeFunction;
  subscribeUser: (
    callback: (payload: TEventPayloadReceive["user"]) => void
  ) => TUnsubscribeFunction;
};
