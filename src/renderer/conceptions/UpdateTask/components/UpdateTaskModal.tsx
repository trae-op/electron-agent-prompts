import {
  memo,
  useActionState,
  useCallback,
  ChangeEvent,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Popup } from "@composites/Popup";
import {
  useUpdateTaskModalTaskSelector,
  useSetUpdateTaskModalTaskDispatch,
  useUpdateTaskModalProjectsSelector,
} from "../context";
import {
  TTaskAgentSkillsFieldProps,
  TTaskIdeFieldProps,
  TUpdateTaskActionArgs,
  TUpdateTaskModalProps,
} from "./types";
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

const TaskProjectField = () => {
  const { pending } = useFormStatus();
  const task = useUpdateTaskModalTaskSelector();
  const projects = useUpdateTaskModalProjectsSelector();

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
};

TaskProjectField.displayName = "TaskProjectField";

const TaskIdeSelectField = memo(({ onChange, ide }: TTaskIdeFieldProps) => {
  const { pending } = useFormStatus();
  const handleChange = useCallback(
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | (Event & {
            target: {
              value: unknown;
              name: string;
            };
          })
    ) => {
      const nextIde = String(event.target.value);
      onChange(nextIde);
    },
    [onChange]
  );

  return (
    <FormControl fullWidth disabled={pending}>
      <InputLabel id="update-task-ide-label">
        Target IDE for Instructions
      </InputLabel>
      <Select
        labelId="update-task-ide-label"
        id="update-task-ide"
        label="Target IDE for Instructions"
        name="ide"
        value={ide}
        disabled={pending}
        data-testid="update-task-ide"
        onChange={handleChange}
      >
        <MenuItem value="vs-code">VS Code</MenuItem>
      </Select>
    </FormControl>
  );
});

TaskIdeSelectField.displayName = "TaskIdeSelectField";

const TaskAgentSkillsField = memo(
  ({ isVisible }: TTaskAgentSkillsFieldProps) => {
    const { pending } = useFormStatus();

    if (!isVisible) {
      return null;
    }

    return (
      <FormControlLabel
        control={
          <Checkbox
            name="agent-skills"
            value="true"
            disabled={pending}
            data-testid="update-task-agent-skills"
          />
        }
        label="Agent Skills"
      />
    );
  }
);

TaskAgentSkillsField.displayName = "TaskAgentSkillsField";

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

const UpdateTaskFields = () => {
  const task = useUpdateTaskModalTaskSelector();
  const [ide, setIde] = useState<string>("");

  if (task === undefined) {
    return null;
  }

  return (
    <Stack spacing={2} key={task.id}>
      <TaskNameField />
      <TaskProjectField />
      <TaskIdeSelectField ide={ide} onChange={setIde} />
      <TaskAgentSkillsField isVisible={ide === "vs-code"} />
      <TaskUploadFileField />
      <TaskFoldersField />
    </Stack>
  );
};

UpdateTaskFields.displayName = "UpdateTaskFields";

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
  const isSkills = formData.get("agent-skills") !== null;

  const response = await window.electron.invoke.updateTask({
    id: task.id,
    name,
    projectId:
      typeof rawProjectId === "string" ? Number(rawProjectId) : task.projectId,
    fileId: task.fileId,
    url: task.url,
    folderPaths,
    ide,
    isSkills: isSkills ? true : undefined,
  });

  if (response !== undefined) {
    onSuccess(response);
    setUpdateTask(undefined);
  }
};

export const UpdateTaskModal = memo(({ onSuccess }: TUpdateTaskModalProps) => {
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
      content={<UpdateTaskFields />}
    />
  );
});

UpdateTaskModal.displayName = "UpdateTaskModal";
