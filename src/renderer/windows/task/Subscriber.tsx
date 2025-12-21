import { LoadingSpinner } from "@components/LoadingSpinner";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSetContentsDispatch } from "@conceptions/Task/Markdown";

export const Subscriber = () => {
  const isSend = useRef(true);
  const { id: taskId } = useParams<{
    id?: string;
  }>();
  const setContentsDispatch = useSetContentsDispatch();

  if (taskId === undefined) {
    return <LoadingSpinner />;
  }

  const subscribeTask = useCallback(() => {
    return window.electron.receive.subscribeWindowTask(({ contents }) => {
      setContentsDispatch(contents);
    });
  }, []);

  useEffect(() => {
    if (isSend.current) {
      isSend.current = false;
      window.electron.send.task({
        taskId,
      });
    }
  }, [taskId]);

  useEffect(() => {
    const unSub = subscribeTask();

    return unSub;
  }, []);

  return null;
};
