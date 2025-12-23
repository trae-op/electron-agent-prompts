import { useCallback } from "react";
import {
  MarkdownContentList,
  useDeleteContentDispatch,
  useContentsSelector,
  useSetContentsDispatch,
} from "@conceptions/Task/Markdown";
import {
  useSetContentDispatch,
  useSetTitleModalOpenDispatch,
} from "@conceptions/Task/Title";
import {
  useSetCodeContentDispatch,
  useSetCodeModalOpenDispatch,
} from "@conceptions/Task/Code";
import {
  useSetListContentDispatch,
  useSetListModalOpenDispatch,
} from "@conceptions/Task/List";
import {
  useSetTextContentDispatch,
  useSetTextModalOpenDispatch,
} from "@conceptions/Task/Text";
import {
  useSetPositionContentDispatch,
  usePositionModalActions,
} from "@conceptions/Task/Position";

const TaskOverview = () => {
  const setContent = useSetContentDispatch();
  const setTitleModalOpen = useSetTitleModalOpenDispatch();
  const setCodeContent = useSetCodeContentDispatch();
  const setCodeModalOpen = useSetCodeModalOpenDispatch();
  const setListContent = useSetListContentDispatch();
  const setListModalOpen = useSetListModalOpenDispatch();
  const setTextContent = useSetTextContentDispatch();
  const setTextModalOpen = useSetTextModalOpenDispatch();
  const setPositionContent = useSetPositionContentDispatch();
  const { openModal: openPositionModal } = usePositionModalActions();
  const deleteContent = useDeleteContentDispatch();
  const contents = useContentsSelector();
  const setContents = useSetContentsDispatch();

  const handleUpdateContent = useCallback(
    (content: TMarkdownContent): void => {
      if (content.type === "title") {
        setContent(content);
        setTitleModalOpen(true);
        return;
      }

      if (content.type === "code") {
        setCodeContent(content);
        setCodeModalOpen(true);
        return;
      }

      if (content.type === "list") {
        setListContent(content);
        setListModalOpen(true);
        return;
      }

      if (content.type === "text") {
        setTextContent(content);
        setTextModalOpen(true);
      }
    },
    [
      setContent,
      setTitleModalOpen,
      setCodeContent,
      setCodeModalOpen,
      setListContent,
      setListModalOpen,
      setTextContent,
      setTextModalOpen,
    ]
  );

  const handleDeleteContent = useCallback(
    (content: TMarkdownContent): void => {
      deleteContent(content.id);
    },
    [deleteContent]
  );

  const handlePositionContent = useCallback(
    (content: TMarkdownContent): void => {
      setPositionContent(content);
      openPositionModal();
    },
    [openPositionModal, setPositionContent]
  );

  const moveContent = useCallback(
    (contentId: string, direction: "up" | "down"): void => {
      const currentIndex = contents.findIndex(({ id }) => id === contentId);

      if (currentIndex === -1) return;

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= contents.length) return;

      const next = [...contents];
      [next[currentIndex], next[targetIndex]] = [
        next[targetIndex],
        next[currentIndex],
      ];

      const reindexed = next.map((item, index) => ({
        ...item,
        position: index,
      }));

      setContents(reindexed);
    },
    [contents, setContents]
  );

  const handleMoveUp = useCallback(
    (content: TMarkdownContent): void => {
      moveContent(content.id, "up");
    },
    [moveContent]
  );

  const handleMoveDown = useCallback(
    (content: TMarkdownContent): void => {
      moveContent(content.id, "down");
    },
    [moveContent]
  );

  return (
    <MarkdownContentList
      onUpdate={handleUpdateContent}
      onDelete={handleDeleteContent}
      onMoveUp={handleMoveUp}
      onPosition={handlePositionContent}
      onMoveDown={handleMoveDown}
    />
  );
};

export default TaskOverview;
