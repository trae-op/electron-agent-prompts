import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Provider as MarkdownProvider } from "@conceptions/Task/Markdown";
import { Subscriber } from "./Subscriber";

const LazyTopPanel = lazy(() => import("./TopPanel"));

const Task = () => {
  const { id } = useParams<{
    id?: string;
  }>();

  if (id === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <MarkdownProvider>
      <Subscriber taskId={id} />
      <Suspense fallback={<LoadingSpinner />}>
        <LazyTopPanel />
      </Suspense>
      taskId: {id}
    </MarkdownProvider>
  );
};

export default Task;
