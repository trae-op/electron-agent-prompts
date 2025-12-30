import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import styled from "@emotion/styled";

type Props = {
  initialPath?: string;
  initialIde?: string;
};

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

export const ConnectInstruction = ({ initialPath, initialIde }: Props) => {
  const { pending } = useFormStatus();
  const [selectedPath, setSelectedPath] = useState<string | undefined>(
    initialPath
  );
  const [ide, setIde] = useState<string>(initialIde ?? "vs-code");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastFileRef = useRef<File | undefined>(undefined);

  useEffect(() => {
    setSelectedPath(initialPath);
  }, [initialPath]);

  useEffect(() => {
    setIde(initialIde ?? "vs-code");
  }, [initialIde]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file =
        event.target.files !== null && event.target.files.length > 0
          ? event.target.files[0]
          : undefined;

      if (file === undefined) {
        setSelectedPath(undefined);
        lastFileRef.current = undefined;
        return;
      }

      lastFileRef.current = file;
      const resolvedPath = window.electron.invoke.resolveFilePath(file);

      await window.electron.invoke.uploadConnectionInstructionFile({
        file,
        ide,
      });

      setSelectedPath(resolvedPath ?? file.name);
    },
    [ide]
  );

  const handleIdeChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setIde(value);

      if (lastFileRef.current !== undefined) {
        await window.electron.invoke.uploadConnectionInstructionFile({
          file: lastFileRef.current,
          ide: value,
        });
      }
    },
    []
  );

  return (
    <Stack spacing={2}>
      <TextField
        select
        label="IDE"
        value={ide}
        onChange={handleIdeChange}
        fullWidth
        disabled={pending}
        data-testid="connect-instruction-ide"
      >
        <MenuItem value="vs-code">VS Code</MenuItem>
      </TextField>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        disabled={pending}
        data-testid="connect-instruction-upload"
      >
        {selectedPath ?? "No connect instruction selected"}
        <VisuallyHiddenInput
          type="file"
          name="connect-instruction"
          onChange={handleFileChange}
          multiple={false}
          disabled={pending}
          ref={inputRef}
        />
      </Button>
    </Stack>
  );
};
