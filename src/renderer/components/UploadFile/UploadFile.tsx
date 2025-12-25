import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const UploadFile = () => {
  const { pending } = useFormStatus();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<
    string | undefined
  >();

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      const file = files !== null && files.length > 0 ? files[0] : undefined;

      if (file !== undefined) {
        await window.electron.invoke.uploadFile({
          file,
        });
      }
      setSelectedFileName(file?.name ?? undefined);
    },
    []
  );

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      disabled={pending}
      data-testid="create-task-upload"
    >
      {selectedFileName ?? "No file selected"}
      <VisuallyHiddenInput
        type="file"
        name="file"
        onChange={handleFileChange}
        multiple={false}
        disabled={pending}
        ref={inputRef}
      />
    </Button>
  );
};
