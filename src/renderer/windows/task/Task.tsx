import { lazy, Suspense } from "react";
import Stack from "@mui/material/Stack";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Provider as MarkdownProvider } from "@conceptions/Task/Markdown";
import { Provider as CodeProvider } from "@conceptions/Task/Code";
import { Provider as TitleProvider } from "@conceptions/Task/Title";
import { Provider as ListProvider } from "@conceptions/Task/List";
import { Provider as TextProvider } from "@conceptions/Task/Text";
import { Provider as AgentSkillsProvider } from "@conceptions/Task/AgentSkills";
import { Provider as ArchitectureProvider } from "@conceptions/Task/Architecture";
import { Provider as PositionProvider } from "@conceptions/Task/Position";
import { Provider as SearchContentProvider } from "@conceptions/Task/SearchContent";
import { Provider as ConverterProvider } from "@conceptions/Task/Converter";
import { Subscriber } from "./Subscriber";
import {
  TitleModal,
  CodeModal,
  ListModal,
  TextModal,
  ArchitectureModal,
  AgentSkillsModal,
  ConverterModal,
  PositionModal,
} from "./InitModals";
import TaskOverview from "./TaskOverview";
import { MarkdownContentListButtons } from "./MarkdownContentListButtons";

const LazyTopPanel = lazy(() => import("./TopPanel"));

const Task = () => {
  return (
    <MarkdownProvider>
      <SearchContentProvider>
        <Subscriber />
        <ConverterProvider>
          <CodeProvider>
            <TitleProvider>
              <ListProvider>
                <TextProvider>
                  <AgentSkillsProvider>
                    <ArchitectureProvider>
                      <Suspense fallback={<LoadingSpinner />}>
                        <LazyTopPanel />
                      </Suspense>

                      <TitleModal />
                      <ListModal />
                      <TextModal />
                      <AgentSkillsModal />
                      <CodeModal />
                      <ArchitectureModal />
                      <ConverterModal />
                      <PositionProvider>
                        <PositionModal />
                        <Stack spacing={1} direction="column" sx={{ mt: 6 }}>
                          <Stack
                            overflow="auto"
                            width="calc(100vw - 25px)"
                            height="calc(100vh - 120px)"
                            sx={{
                              "&::-webkit-scrollbar": {
                                width: 4,

                                backgroundColor: "lightgrey",
                              },

                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "black",
                                height: 30,
                                cursor: "pointer",
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
                    </ArchitectureProvider>
                  </AgentSkillsProvider>
                </TextProvider>
              </ListProvider>
            </TitleProvider>
          </CodeProvider>
        </ConverterProvider>
      </SearchContentProvider>
    </MarkdownProvider>
  );
};

export default Task;
