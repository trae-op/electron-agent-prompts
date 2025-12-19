import { useContext } from "react";

import { Context } from "./Context";

export const useMarkdownContext = () => {
  const markdownContext = useContext(Context);

  if (!markdownContext)
    throw new Error("Markdown context must be used within Provider");

  return markdownContext;
};
