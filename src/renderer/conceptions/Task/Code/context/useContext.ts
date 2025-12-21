import { useContext } from "react";

import { Context } from "./Context";

export const useCodeContext = () => {
  const codeContext = useContext(Context);

  if (!codeContext)
    throw new Error("Code context must be used within Provider");

  return codeContext;
};
