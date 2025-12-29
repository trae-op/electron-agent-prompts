import { useContext } from "react";

import { Context } from "./Context";

export const useArchitectureContext = () => {
  const architectureContext = useContext(Context);

  if (!architectureContext)
    throw new Error("Architecture context must be used within Provider");

  return architectureContext;
};
