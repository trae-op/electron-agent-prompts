import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useParams } from "react-router-dom";
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
    <>
      <Subscriber taskId={id} />
      <Suspense fallback={<LoadingSpinner />}>
        <LazyTopPanel />
      </Suspense>
      taskId: {id}
    </>
  );
};

export default Task;
