import { useContext } from "react";

import { Context } from "./Context";

export const useTasksContext = () => {
  const tasksContext = useContext(Context);

  if (!tasksContext) {
    throw new Error("Tasks useTasksContext must be used inside Provider");
  }

  return tasksContext;
};
