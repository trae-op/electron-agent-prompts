import { useContext } from "react";

import { Context } from "./Context";

export const useAgentSkillsContext = (): NonNullable<
  React.ContextType<typeof Context>
> => {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error("AgentSkills context is not provided");
  }

  return ctx;
};
