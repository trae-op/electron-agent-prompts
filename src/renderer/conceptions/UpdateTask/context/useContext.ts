import { useContext } from "react";

import { Context } from "./Context";
import type { TContext } from "./types";

export const useUpdateTaskContext = (): TContext => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error("UpdateTask context is not available");
  }

  return context;
};
