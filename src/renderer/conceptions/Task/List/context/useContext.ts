import { useContext } from "react";

import { Context } from "./Context";

export const useListContext = () => {
  const listContext = useContext(Context);

  if (!listContext)
    throw new Error("List context must be used within Provider");

  return listContext;
};
