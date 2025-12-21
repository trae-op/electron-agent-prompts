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

const TaskOverview = () => {
  const setContent = useSetContentDispatch();
  const setTitleModalOpen = useSetTitleModalOpenDispatch();
  const setCodeContent = useSetCodeContentDispatch();
  const setCodeModalOpen = useSetCodeModalOpenDispatch();

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
      }
    },
    [setContent, setTitleModalOpen, setCodeContent, setCodeModalOpen]
  );

  return <MarkdownContentList onUpdate={handleUpdateContent} />;
};

export default TaskOverview;
