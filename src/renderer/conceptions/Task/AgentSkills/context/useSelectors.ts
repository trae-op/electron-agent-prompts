import { useSyncExternalStore } from "react";

import { useAgentSkillsContext } from "./useContext";

export const useAgentSkillsModalOpenSelector = (): boolean => {
  const { getIsOpen, subscribe } = useAgentSkillsContext();

  return useSyncExternalStore(subscribe, getIsOpen, getIsOpen);
};

export const useAgentSkillsContentValueSelector = ():
  | TMarkdownContent
  | undefined => {
  const { getContent, subscribe } = useAgentSkillsContext();

  return useSyncExternalStore(subscribe, getContent, getContent);
};

export const useSetAgentSkillsModalOpenDispatch = () => {
  return useAgentSkillsContext().setIsOpen;
};

export const useSetAgentSkillsContentDispatch = () => {
  return useAgentSkillsContext().setContent;
};
