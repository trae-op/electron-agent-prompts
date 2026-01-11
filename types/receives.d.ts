type TUnsubscribeFunction = () => void;

type TEventPayloadReceive = {
  updateApp: TUpdateData;
  openUpdateApp: TOpenUpdateApp;
  auth: TAuth;
  user: {
    user: TUser;
  };
  projects: {
    projects: TProject[];
  };
  tasks: {
    tasks: TTask[];
  };
  updateTask: {
    task: TTask;
  };
  task: {
    task: TTask;
    contents: TMarkdownContent[];
  };
  "search-result": {
    activeMatchOrdinal: number;
    matches: number;
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
  subscribeUpdateTask: (
    callback: (payload: TEventPayloadReceive["updateTask"]) => void
  ) => TUnsubscribeFunction;
  subscribeWindowTask: (
    callback: (payload: TEventPayloadReceive["task"]) => void
  ) => TUnsubscribeFunction;
  subscribeUser: (
    callback: (payload: TEventPayloadReceive["user"]) => void
  ) => TUnsubscribeFunction;
  subscribeProjects: (
    callback: (payload: TEventPayloadReceive["projects"]) => void
  ) => TUnsubscribeFunction;
  subscribeTasks: (
    callback: (payload: TEventPayloadReceive["tasks"]) => void
  ) => TUnsubscribeFunction;
  subscribeSearchResult: (
    callback: (payload: TEventPayloadReceive["search-result"]) => void
  ) => TUnsubscribeFunction;
};
