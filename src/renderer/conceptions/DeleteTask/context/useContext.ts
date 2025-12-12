import { useContext } from "react";

import { Context } from "./Context";
import type { TContext } from "./types";

export const useDeleteTaskContext = (): TContext => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error("DeleteTask context is not available");
  }

  return context;
};
