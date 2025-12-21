import { useCallback } from "react";
import { MarkdownContentList } from "@conceptions/Task/Markdown";
import {
  useSetContentDispatch,
  useSetTitleModalOpenDispatch,
} from "@conceptions/Task/Title";

const TaskOverview = () => {
  const setContent = useSetContentDispatch();
  const setTitleModalOpen = useSetTitleModalOpenDispatch();

  const handleUpdateContent = useCallback((content: TMarkdownContent): void => {
    if (content.type === "title") {
      setContent(content);
    }
    setTitleModalOpen(true);
  }, []);

  return <MarkdownContentList onUpdate={handleUpdateContent} />;
};

export default TaskOverview;
