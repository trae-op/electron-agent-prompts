import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";
import {
  Provider as MarkdownProvider,
  ApplyButton,
} from "@conceptions/Task/Markdown";
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
      <Stack spacing={1} direction="column" sx={{ mt: 6 }}>
        <Stack
          width="calc(100vw - 25px)"
          height="calc(100vh - 120px)"
          sx={{
            "&::-webkit-scrollbar": {
              width: 0,
            },
          }}
          direction="column"
          spacing={1}
        >
          <h2>title</h2>
        </Stack>
        <Stack spacing={1}>
          <ApplyButton />
        </Stack>
      </Stack>
    </MarkdownProvider>
  );
};

export default Task;
