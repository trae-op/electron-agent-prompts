import { useContext } from "react";

import { Context } from "./Context";

export const useSearchContentContext = () => {
  const searchContext = useContext(Context);

  if (!searchContext)
    throw new Error("SearchContent context must be used within Provider");

  return searchContext;
};
