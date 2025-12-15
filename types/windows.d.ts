type TWindows = {
  main: "window:main";
  preloadApp: "window:preload-app";
  updateApp: "window:update-app";
  auth: "window:auth";
  task: `window:task/:${string}`;
};

type TParamOpenWindows = {
  hash: TWindows[keyof TWindows];
  options?: Electron.BrowserWindowConstructorOptions | undefined;
};
