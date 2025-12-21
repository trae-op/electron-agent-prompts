import { useCallback } from "react";

import { TitleModal as TitleModalComponent } from "@conceptions/Task/Title";
import {
  useAddContentDispatch,
  useContentsSelector,
  useUpdateContentDispatch,
} from "@conceptions/Task/Markdown";

export const TitleModal = () => {
  const contents = useContentsSelector();
  const addContentDispatch = useAddContentDispatch();
  const updateContentDispatch = useUpdateContentDispatch();

  const handleSuccess = useCallback((data: TMarkdownContent) => {
    addContentDispatch(data);
  }, []);

  const handleUpdate = useCallback((data: TMarkdownContent) => {
    updateContentDispatch(data);
  }, []);

  return (
    <TitleModalComponent
      contents={contents}
      onSuccess={handleSuccess}
      onUpdate={handleUpdate}
    />
  );
};
