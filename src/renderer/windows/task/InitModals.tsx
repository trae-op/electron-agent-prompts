import { useCallback } from "react";

import { TitleModal as TitleModalComponent } from "@conceptions/Task/Title";
import { CodeModal as CodeModalComponent } from "@conceptions/Task/Code";
import {
  useAddContentDispatch,
  useContentsSelector,
  useUpdateContentDispatch,
} from "@conceptions/Task/Markdown";

export const TitleModal = () => {
  const contents = useContentsSelector();
  const addContentDispatch = useAddContentDispatch();
  const updateContentDispatch = useUpdateContentDispatch();

  const handleSuccess = useCallback(
    (data: TMarkdownContent) => {
      addContentDispatch(data);
    },
    [addContentDispatch]
  );

  const handleUpdate = useCallback(
    (data: TMarkdownContent) => {
      updateContentDispatch(data);
    },
    [updateContentDispatch]
  );

  return (
    <TitleModalComponent
      contents={contents}
      onSuccess={handleSuccess}
      onUpdate={handleUpdate}
    />
  );
};

export const CodeModal = () => {
  const contents = useContentsSelector();
  const addContentDispatch = useAddContentDispatch();
  const updateContentDispatch = useUpdateContentDispatch();

  const handleSuccess = useCallback(
    (data: TMarkdownContent) => {
      addContentDispatch(data);
    },
    [addContentDispatch]
  );

  const handleUpdate = useCallback(
    (data: TMarkdownContent) => {
      updateContentDispatch(data);
    },
    [updateContentDispatch]
  );

  return (
    <CodeModalComponent
      contents={contents}
      onSuccess={handleSuccess}
      onUpdate={handleUpdate}
    />
  );
};
