import { useContext } from "react";

import { Context } from "./Context";

export const useTextContext = () => {
  const textContext = useContext(Context);

  if (!textContext)
    throw new Error("Text context must be used within Provider");

  return textContext;
};
