import { useCallback } from "react";

import { TitleModal as TitleModalComponent } from "@conceptions/Task/Title";
import { useAddContentDispatch } from "@conceptions/Task/Markdown";

export const TitleModal = () => {
  const addContentDispatch = useAddContentDispatch();

  const handleSuccess = useCallback((data: TMarkdownContent) => {
    addContentDispatch(data);
  }, []);

  return <TitleModalComponent onSuccess={handleSuccess} />;
};
