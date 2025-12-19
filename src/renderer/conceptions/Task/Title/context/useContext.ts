import { useContext } from "react";

import { Context } from "./Context";

export const useTitleContext = () => {
  const titleContext = useContext(Context);

  if (!titleContext)
    throw new Error("Title context must be used within Provider");

  return titleContext;
};
