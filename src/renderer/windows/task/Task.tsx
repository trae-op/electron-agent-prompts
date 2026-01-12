import { lazy, Suspense, useRef } from "react";
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

const LazyTopPanel = lazy(() => import("./TopPanel"));
const LazyTaskOverview = lazy(() => import("./TaskOverview"));
const LazyMarkdownContentListButtons = lazy(
  () => import("./MarkdownContentListButtons")
);

const Task = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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
                        <Stack
                          direction="column"
                          width="100%"
                          sx={{
                            mt: 6.3,
                          }}
                        >
                          <Stack
                            ref={scrollContainerRef}
                            overflow="auto"
                            width="100%"
                            height="calc(100vh - 110px)"
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
                            <Suspense fallback={<LoadingSpinner />}>
                              <LazyTaskOverview />
                            </Suspense>
                          </Stack>

                          <Suspense fallback={<LoadingSpinner />}>
                            <LazyMarkdownContentListButtons
                              containerRef={scrollContainerRef}
                            />
                          </Suspense>
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
