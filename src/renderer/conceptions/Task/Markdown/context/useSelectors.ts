import { useSyncExternalStore } from "react";

import { useMarkdownContext } from "./useContext";

export function useContentsSelector() {
  const { getContents, subscribe } = useMarkdownContext();
  return useSyncExternalStore(subscribe, getContents, getContents);
}

export const useUpdateContentDispatch = () => {
  return useMarkdownContext().updateContent;
};

export const useSetContentsDispatch = () => {
  return useMarkdownContext().setContents;
};

export const useAddContentDispatch = () => {
  return useMarkdownContext().addContent;
};

export const useDeleteContentDispatch = () => {
  return useMarkdownContext().deleteContent;
};
