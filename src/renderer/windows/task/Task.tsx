import { lazy, Suspense } from "react";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Provider as MarkdownProvider } from "@conceptions/Task/Markdown";
import { Provider as CodeProvider } from "@conceptions/Task/Code";
import { Provider as TitleProvider } from "@conceptions/Task/Title";
import { Provider as ListProvider } from "@conceptions/Task/List";
import { Provider as TextProvider } from "@conceptions/Task/Text";
import { Provider as PositionProvider } from "@conceptions/Task/Position";
import { Subscriber } from "./Subscriber";
import {
  TitleModal,
  CodeModal,
  ListModal,
  TextModal,
  PositionModal,
} from "./InitModals";
import TaskOverview from "./TaskOverview";
import { MarkdownContentListButtons } from "./MarkdownContentListButtons";

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
              <PositionProvider>
                <PositionModal />
                <Stack spacing={1} direction="column" sx={{ mt: 6 }}>
                  <Stack
                    overflow="auto"
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
                  <Stack width="100%" direction="row">
                    <MarkdownContentListButtons />
                  </Stack>
                </Stack>
              </PositionProvider>
            </TextProvider>
          </ListProvider>
        </TitleProvider>
      </CodeProvider>
    </MarkdownProvider>
  );
};

export default Task;
