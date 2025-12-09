import { useContext } from "react";

import { Context } from "./Context";
import type { TContext } from "./types";

export const useCreateProjectContext = (): TContext => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error("CreateProject context is not available");
  }

  return context;
};
