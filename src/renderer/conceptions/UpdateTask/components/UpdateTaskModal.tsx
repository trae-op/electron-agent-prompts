import { memo, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";

import { Popup } from "@composites/Popup";
import {
  useUpdateTaskModalTaskSelector,
  useSetUpdateTaskModalTaskDispatch,
} from "../context";
import { TUpdateTaskModalProps } from "./types";
import { UploadFile } from "@components/UploadFile";
import { FoldersInput } from "@components/FoldersInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { parseFoldersFromFormData } from "@utils/folders";

const TaskNameField = memo(() => {
  const { pending } = useFormStatus();
  const task = useUpdateTaskModalTaskSelector();

  if (task === undefined) {
    return null;
  }

  return (
    <TextField
      data-testid="update-task-name"
      name="name"
      id="update-task-name"
      label="Task Name"
      placeholder="My agent prompt task"
      defaultValue={task.name}
      autoFocus
      autoComplete="off"
      fullWidth
      disabled={pending}
    />
  );
});

TaskNameField.displayName = "TaskNameField";

type TProjectFieldProps = {
  projects: TProject[];
};

const TaskProjectField = memo(({ projects }: TProjectFieldProps) => {
  const { pending } = useFormStatus();
  const task = useUpdateTaskModalTaskSelector();

  if (task === undefined) {
    return null;
  }

  return (
    <FormControl fullWidth disabled={pending}>
      <InputLabel id="project-id-select-label">Projects</InputLabel>
      <Select
        labelId="project-id-select-label"
        id="project-id-select"
        defaultValue={task.projectId ?? ""}
        label="Projects"
        name="projectId"
        disabled={pending}
      >
        {projects
          .map((project) => {
            const parsedId = Number(project.id);
            if (!Number.isFinite(parsedId)) {
              return undefined;
            }

            return (
              <MenuItem key={project.id} value={parsedId}>
                {project.name}
              </MenuItem>
            );
          })
          .filter(Boolean)}
      </Select>
    </FormControl>
  );
});

TaskProjectField.displayName = "TaskProjectField";

const TaskIdeField = memo(() => {
  const { pending } = useFormStatus();
  const task = useUpdateTaskModalTaskSelector();

  if (task === undefined) {
    return null;
  }

  return (
    <TextField
      select
      name="ide"
      id="update-task-ide"
      label="Target IDE for Instructions"
      defaultValue={task.ide ?? "vs-code"}
      fullWidth
      disabled={pending}
      data-testid="update-task-ide"
    >
      <MenuItem value="vs-code">VS Code</MenuItem>
    </TextField>
  );
});

TaskIdeField.displayName = "TaskIdeField";

const TaskUploadFileField = memo(() => {
  return <UploadFile />;
});

TaskUploadFileField.displayName = "TaskUploadFileField";

const TaskFoldersField = memo(() => {
  const task = useUpdateTaskModalTaskSelector();

  if (task === undefined) {
    return null;
  }

  return <FoldersInput defaultFolders={task.foldersContentFiles ?? []} />;
});

TaskFoldersField.displayName = "TaskFoldersField";

const UpdateTaskFields = memo(({ projects }: TProjectFieldProps) => {
  const task = useUpdateTaskModalTaskSelector();

  if (task === undefined) {
    return null;
  }

  return (
    <Stack spacing={2} key={task.id}>
      <TaskNameField />
      <TaskProjectField projects={projects} />
      <TaskIdeField />
      <TaskUploadFileField />
      <TaskFoldersField />
    </Stack>
  );
});

UpdateTaskFields.displayName = "UpdateTaskFields";

type TUpdateTaskActionArgs = {
  task: TTask;
  onSuccess: (data: TTask) => void;
  setUpdateTask: (task: TTask | undefined) => void;
};

const submitUpdateTask = async (
  { task, onSuccess, setUpdateTask }: TUpdateTaskActionArgs,
  formData: FormData
): Promise<void> => {
  const rawName = formData.get("name");
  const rawProjectId = formData.get("projectId");
  const name = typeof rawName === "string" ? rawName.trim() : "";

  const rawIde = formData.get("ide");
  const ide =
    typeof rawIde === "string" && rawIde.trim().length > 0
      ? rawIde.trim()
      : undefined;

  const folderPaths = parseFoldersFromFormData(formData);

  const response = await window.electron.invoke.updateTask({
    id: task.id,
    name,
    projectId:
      typeof rawProjectId === "string" ? Number(rawProjectId) : task.projectId,
    fileId: task.fileId,
    url: task.url,
    folderPaths,
    ide,
  });

  if (response !== undefined) {
    onSuccess(response);
    setUpdateTask(undefined);
  }
};

export const UpdateTaskModal = memo(
  ({ onSuccess, projects }: TUpdateTaskModalProps) => {
    const task = useUpdateTaskModalTaskSelector();
    const setUpdateTask = useSetUpdateTaskModalTaskDispatch();

    const [, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          if (task === undefined) {
            return undefined;
          }

          await submitUpdateTask({ task, onSuccess, setUpdateTask }, formData);
          return undefined;
        },
        [onSuccess, setUpdateTask, task]
      ),
      undefined
    );

    const handleClose = useCallback(() => {
      setUpdateTask(undefined);
    }, [setUpdateTask]);

    return (
      <Popup
        title="Update task"
        description="Update the task name."
        isOpen={task !== undefined}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel="Save Changes"
        confirmPendingLabel="Saving..."
        formTestId="update-task-form"
        messageTestId="update-task-message"
        content={<UpdateTaskFields projects={projects} />}
      />
    );
  }
);

UpdateTaskModal.displayName = "UpdateTaskModal";
