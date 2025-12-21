import { useCallback } from "react";

import { TitleModal as TitleModalComponent } from "@conceptions/Task/Title";
import {
  useAddContentDispatch,
  useContentsSelector,
} from "@conceptions/Task/Markdown";

export const TitleModal = () => {
  const contents = useContentsSelector();
  const addContentDispatch = useAddContentDispatch();

  const handleSuccess = useCallback((data: TMarkdownContent) => {
    addContentDispatch(data);
  }, []);

  return <TitleModalComponent contents={contents} onSuccess={handleSuccess} />;
};
