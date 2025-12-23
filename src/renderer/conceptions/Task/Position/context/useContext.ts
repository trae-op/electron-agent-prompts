import { useContext } from "react";

import { Context } from "./Context";

export const usePositionContext = () => {
  const positionContext = useContext(Context);

  if (!positionContext)
    throw new Error("Position context must be used within Provider");

  return positionContext;
};
