type TEventPayloadSend = {
  restart: undefined;
  windowClosePreload: undefined;
  user: undefined;
  projects: undefined;
  tasks: {
    projectId: number;
  };
  task: {
    taskId: string;
  };
  findInPage: {
    text: string;
    options?: {
      forward?: boolean;
      findNext?: boolean;
    };
  };
  stopFindInPage: undefined;
  logout: undefined;
  checkForUpdates: undefined;
  checkAuth: undefined;
  windowAuth: {
    provider: TProviders;
  };
  windowTask: {
    id: string;
  };
  openLatestVersion: TOpenLatestVersion;
  openUpdate: {
    id: string;
  };
};

type TSend = {
  restart: () => void;
  windowClosePreload: () => void;
  user: () => void;
  projects: () => void;
  tasks: (payload: TEventPayloadSend["tasks"]) => void;
  task: (payload: TEventPayloadSend["task"]) => void;
  findInPage: (payload: TEventPayloadSend["findInPage"]) => void;
  stopFindInPage: () => void;
  checkAuth: () => void;
  logout: () => void;
  checkForUpdates: () => void;
  windowAuth: (payload: TEventPayloadSend["windowAuth"]) => void;
  windowTask: (payload: TEventPayloadSend["windowTask"]) => void;
  openLatestVersion: (payload: TEventPayloadSend["openLatestVersion"]) => void;
  windowOpenUpdate: (payload: TEventPayloadSend["openUpdate"]) => void;
};
