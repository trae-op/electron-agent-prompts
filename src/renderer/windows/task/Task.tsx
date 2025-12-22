import { lazy, Suspense } from "react";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";
import {
  Provider as MarkdownProvider,
  SaveButton,
} from "@conceptions/Task/Markdown";
import { Provider as CodeProvider } from "@conceptions/Task/Code";
import { Provider as TitleProvider } from "@conceptions/Task/Title";
import { Provider as ListProvider } from "@conceptions/Task/List";
import { Provider as TextProvider } from "@conceptions/Task/Text";
import { Subscriber } from "./Subscriber";
import { TitleModal, CodeModal, ListModal, TextModal } from "./InitModals";
import TaskOverview from "./TaskOverview";

const LazyTopPanel = lazy(() => import("./TopPanel"));

const Task = () => {
  return (
    <MarkdownProvider>
      <Subscriber />
      <CodeProvider>
        <TitleProvider>
          <ListProvider>
            <TextProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <LazyTopPanel />
              </Suspense>
              <TitleModal />
              <ListModal />
              <TextModal />
              <CodeModal />
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
                  <TaskOverview />
                </Stack>
                <Stack spacing={1}>
                  <SaveButton />
                </Stack>
              </Stack>
            </TextProvider>
          </ListProvider>
        </TitleProvider>
      </CodeProvider>
    </MarkdownProvider>
  );
};

export default Task;
