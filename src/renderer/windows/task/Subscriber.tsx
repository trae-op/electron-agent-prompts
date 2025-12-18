import { memo, useCallback, useEffect } from "react";

export const Subscriber = memo(({ taskId }: { taskId: string }) => {
  const subscribeTask = useCallback(() => {
    return window.electron.receive.subscribeWindowTask(({ task }) => {
      console.log("Received task:", task);
    });
  }, []);

  useEffect(() => {
    window.electron.send.task({
      taskId,
    });
  }, [taskId]);

  useEffect(() => {
    const unSub = subscribeTask();

    return unSub;
  }, []);

  return null;
});
