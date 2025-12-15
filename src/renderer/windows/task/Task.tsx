import { useParams } from "react-router-dom";

const Task = () => {
  const { id } = useParams<{
    id?: string;
  }>();

  return <>Task! id: {id}</>;
};

export default Task;
