import { useCallback } from "react";
import { MarkdownContentList } from "@conceptions/Task/Markdown";
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

const TaskOverview = () => {
  const setContent = useSetContentDispatch();
  const setTitleModalOpen = useSetTitleModalOpenDispatch();
  const setCodeContent = useSetCodeContentDispatch();
  const setCodeModalOpen = useSetCodeModalOpenDispatch();
  const setListContent = useSetListContentDispatch();
  const setListModalOpen = useSetListModalOpenDispatch();
  const setTextContent = useSetTextContentDispatch();
  const setTextModalOpen = useSetTextModalOpenDispatch();

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

  return <MarkdownContentList onUpdate={handleUpdateContent} />;
};

export default TaskOverview;
