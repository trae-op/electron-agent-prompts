import { useContext } from "react";

import { Context } from "./Context";

export const useProjectsContext = () => {
  const projectsContext = useContext(Context);

  if (!projectsContext) {
    throw new Error("Projects useProjectsContext must be used inside Provider");
  }

  return projectsContext;
};
