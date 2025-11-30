import { useContext } from "react";

import { Context, PopoverContext } from "./Context";

export const useEntityContext = () => {
  const entityContext = useContext(Context);

  if (!entityContext)
    throw new Error("User useEntityContext must be used within a Provider");

  return entityContext;
};

export const usePopoverEntityContext = () => {
  const entityContext = useContext(PopoverContext);

  if (!entityContext)
    throw new Error(
      "User usePopoverEntityContext must be used within a PopoverProvider"
    );
  return entityContext;
};
