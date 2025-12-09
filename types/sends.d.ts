type TEventPayloadSend = {
  restart: undefined;
  windowClosePreload: undefined;
  user: undefined;
  logout: undefined;
  checkForUpdates: undefined;
  checkAuth: undefined;
  windowAuth: {
    provider: TProviders;
  };
  openLatestVersion: TOpenLatestVersion;
  createProject: {
    name: string;
  };
  openUpdate: {
    id: string;
  };
};

type TSend = {
  restart: () => void;
  windowClosePreload: () => void;
  user: () => void;
  checkAuth: () => void;
  logout: () => void;
  checkForUpdates: () => void;
  windowAuth: (payload: TEventPayloadSend["windowAuth"]) => void;
  openLatestVersion: (payload: TEventPayloadSend["openLatestVersion"]) => void;
  createProject: (payload: TEventPayloadSend["createProject"]) => void;
  windowOpenUpdate: (payload: TEventPayloadSend["openUpdate"]) => void;
};
