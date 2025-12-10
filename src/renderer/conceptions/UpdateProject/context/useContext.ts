import { useContext } from "react";

import { Context } from "./Context";
import type { TContext } from "./types";

export const useUpdateProjectContext = (): TContext => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error("UpdateProject context is not available");
  }

  return context;
};
