type TUnsubscribeFunction = () => void;

type TEventPayloadReceive = {
  updateApp: TUpdateData;
  openUpdateApp: TOpenUpdateApp;
  auth: TAuth;
  user: {
    user: TUser;
  };
};

type TReceive = {
  subscribeWindowOpenUpdateApp: (
    callback: (payload: TEventPayloadReceive["openUpdateApp"]) => void
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
