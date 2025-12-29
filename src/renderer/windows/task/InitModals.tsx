import { useCallback } from "react";

import { TitleModal as TitleModalComponent } from "@conceptions/Task/Title";
import { CodeModal as CodeModalComponent } from "@conceptions/Task/Code";
import { ListModal as ListModalComponent } from "@conceptions/Task/List";
import { TextModal as TextModalComponent } from "@conceptions/Task/Text";
import { ArchitectureModal as ArchitectureModalComponent } from "@conceptions/Task/Architecture";
import { PositionModal as PositionModalComponent } from "@conceptions/Task/Position";
import { TextControlPanel } from "@conceptions/Task/TextControlPanel";
import {
  useAddContentDispatch,
  useContentsSelector,
  useSetContentsDispatch,
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
      controlPanel={<TextControlPanel />}
    />
  );
};

export const PositionModal = () => {
  const contents = useContentsSelector();
  const setContents = useSetContentsDispatch();

  const handleReorder = useCallback(
    (data: TMarkdownContent[]) => {
      setContents(data);
    },
    [setContents]
  );

  return (
    <PositionModalComponent contents={contents} onReorder={handleReorder} />
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

export const ListModal = () => {
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
    <ListModalComponent
      contents={contents}
      onSuccess={handleSuccess}
      onUpdate={handleUpdate}
      controlPanel={<TextControlPanel />}
    />
  );
};

export const TextModal = () => {
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
    <TextModalComponent
      contents={contents}
      onSuccess={handleSuccess}
      onUpdate={handleUpdate}
      controlPanel={<TextControlPanel />}
    />
  );
};

export const ArchitectureModal = () => {
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
    <ArchitectureModalComponent
      contents={contents}
      onSuccess={handleSuccess}
      onUpdate={handleUpdate}
      controlPanel={<TextControlPanel />}
    />
  );
};
