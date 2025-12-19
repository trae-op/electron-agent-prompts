import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { Provider as MarkdownProvider } from "../../conceptions/Task/Markdown";
import { Subscriber } from "./Subscriber";
const LazyTopPanel = lazy(() => import("./TopPanel"));

const Task = () => {
  const { id } = useParams<{
    id?: string;
  }>();

  return (
    <MarkdownProvider>
      {id === undefined ? (
        <LoadingSpinner />
      ) : (
        <>
          <Subscriber taskId={id} />
          <Suspense fallback={<LoadingSpinner />}>
            <LazyTopPanel />
          </Suspense>
          taskId: {id}
        </>
      )}
    </MarkdownProvider>
  );
};

export default Task;
