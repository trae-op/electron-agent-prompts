import { useContext } from "react";

import { Context } from "./Context";
import type { TContext } from "./types";

export const useDeleteProjectContext = (): TContext => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error("DeleteProject context is not available");
  }

  return context;
};
