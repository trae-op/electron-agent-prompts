import { useContext } from "react";

import { Context } from "./Context";
import type { TContext } from "./types";

export const useCreateTaskContext = (): TContext => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error("CreateTask context is not available");
  }

  return context;
};
