import type { PropsWithChildren, ReactElement } from "react";

export type TProviderProps = PropsWithChildren;
export type TPopoverProviderProps = PropsWithChildren & {
  renderButtonUpdateApp: ReactElement | null;
  renderButtonLogout: ReactElement | null;
  isNewVersionApp?: boolean;
};

export type TSubscriberCallback = () => void;

export type TContext = {
  getUser: () => TUser | undefined;
  setUser: (value: TUser | undefined) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TPopoverContext = {
  getRenderButtonUpdateApp: () => ReactElement | null;
  getRenderButtonLogout: () => ReactElement | null;
  getNewVersionApp: () => boolean | undefined;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
