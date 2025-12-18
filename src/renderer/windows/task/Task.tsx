import { LoadingSpinner } from "@components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { Subscriber } from "./Subscriber";

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
    </>
  );
};

export default Task;
