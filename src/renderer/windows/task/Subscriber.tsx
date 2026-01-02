import { LoadingSpinner } from "@components/LoadingSpinner";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSetContentsDispatch } from "@conceptions/Task/Markdown";
import { useSetSearchResultDispatch } from "@conceptions/Task/SearchContent";

export const Subscriber = () => {
  const isSend = useRef(true);
  const { id: taskId } = useParams<{
    id?: string;
  }>();
  const setContentsDispatch = useSetContentsDispatch();
  const setSearchResult = useSetSearchResultDispatch();

  if (taskId === undefined) {
    return <LoadingSpinner />;
  }

  const subscribeTask = useCallback(() => {
    return window.electron.receive.subscribeWindowTask(({ contents }) => {
      setContentsDispatch(contents);
    });
  }, [setContentsDispatch]);

  const subscribeSearchResult = useCallback(() => {
    return window.electron.receive.subscribeSearchResult(
      ({ activeMatchOrdinal, matches }) => {
        setSearchResult({
          activeMatchOrdinal,
          matches,
        });
      }
    );
  }, [setSearchResult]);

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
    const unSubSearch = subscribeSearchResult();

    return () => {
      unSub();
      unSubSearch();
    };
  }, [subscribeSearchResult, subscribeTask]);

  return null;
};
