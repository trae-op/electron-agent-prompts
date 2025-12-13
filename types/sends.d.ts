type TEventPayloadSend = {
  restart: undefined;
  windowClosePreload: undefined;
  user: undefined;
  projects: undefined;
  tasks: {
    projectId: number;
  };
  logout: undefined;
  checkForUpdates: undefined;
  checkAuth: undefined;
  windowAuth: {
    provider: TProviders;
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
  checkAuth: () => void;
  logout: () => void;
  checkForUpdates: () => void;
  windowAuth: (payload: TEventPayloadSend["windowAuth"]) => void;
  openLatestVersion: (payload: TEventPayloadSend["openLatestVersion"]) => void;
  windowOpenUpdate: (payload: TEventPayloadSend["openUpdate"]) => void;
};
