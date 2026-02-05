import { memo, useActionState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Popup } from "@composites/Popup";
import { useCreateTaskModalActions } from "../hooks";
import { TCreateTaskModalProps } from "./types";
import {
  useCreateTaskModalOpenSelector,
  useCreateTaskModalIsSettingsSelector,
  useSetCreateTaskModalIsSettingsDispatch,
  useCreateTaskModalIsSkillsSelector,
  useSetCreateTaskModalIsSkillsDispatch,
} from "../context";
import { UploadFile } from "@components/UploadFile";
import { FoldersInput } from "@components/FoldersInput";
import { parseFoldersFromFormData } from "@utils/folders";

const TaskNameField = memo(() => {
  const { pending } = useFormStatus();

  return (
    <TextField
      data-testid="create-task-name"
      name="name"
      id="create-task-name"
      label="Task Name"
      placeholder="My agent prompt task"
      autoFocus
      autoComplete="off"
      fullWidth
      disabled={pending}
    />
  );
});

TaskNameField.displayName = "TaskNameField";

const TaskIdeField = memo(() => {
  const { pending } = useFormStatus();

  return (
    <TextField
      select
      name="ide"
      id="create-task-ide"
      label="Target IDE for Instructions"
      defaultValue="vs-code"
      fullWidth
      disabled={pending}
      data-testid="create-task-ide"
    >
      <MenuItem value="vs-code">VS Code</MenuItem>
    </TextField>
  );
});

TaskIdeField.displayName = "TaskIdeField";

const TaskAddToSettingsField = memo(() => {
  const { pending } = useFormStatus();
  const isSettings = useCreateTaskModalIsSettingsSelector();
  const setIsSettings = useSetCreateTaskModalIsSettingsDispatch();
  const setIsSkills = useSetCreateTaskModalIsSkillsDispatch();

  const handleChange = useCallback(
    (_event: unknown, checked: boolean) => {
      setIsSettings(checked);
      if (checked) {
        setIsSkills(false);
      }
    },
    [setIsSettings, setIsSkills],
  );

  return (
    <FormControlLabel
      control={
        <Checkbox
          name="add-to-settings"
          value="true"
          disabled={pending}
          data-testid="create-task-add-to-settings"
          checked={isSettings}
          onChange={handleChange}
        />
      }
      label="Add to settings"
    />
  );
});

TaskAddToSettingsField.displayName = "TaskAddToSettingsField";

const TaskAgentSkillsField = memo(() => {
  const { pending } = useFormStatus();
  const isSkills = useCreateTaskModalIsSkillsSelector();
  const isSettings = useCreateTaskModalIsSettingsSelector();
  const setIsSkills = useSetCreateTaskModalIsSkillsDispatch();

  const handleChange = useCallback(
    (_event: unknown, checked: boolean) => {
      setIsSkills(checked);
    },
    [setIsSkills],
  );

  if (isSettings) {
    return null;
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          name="agent-skills"
          value="true"
          disabled={pending}
          data-testid="create-task-agent-skills"
          checked={isSkills}
          onChange={handleChange}
        />
      }
      label="Agent Skills"
    />
  );
});

TaskAgentSkillsField.displayName = "TaskAgentSkillsField";

const TaskUploadFileField = memo(() => {
  return <UploadFile />;
});

TaskUploadFileField.displayName = "TaskUploadFileField";

const TaskFoldersField = memo(() => {
  return <FoldersInput />;
});

TaskFoldersField.displayName = "TaskFoldersField";

const Fields = () => {
  return (
    <Stack spacing={2}>
      <TaskNameField />
      <TaskIdeField />
      <TaskAddToSettingsField />
      <TaskAgentSkillsField />
      <TaskUploadFileField />
      <TaskFoldersField />
    </Stack>
  );
};

export const CreateTaskModal = memo(({ onSuccess }: TCreateTaskModalProps) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isOpen = useCreateTaskModalOpenSelector();
  const { closeModal } = useCreateTaskModalActions();

  const [, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        if (projectId === undefined) {
          return undefined;
        }

        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        const rawIde = formData.get("ide");
        const ide =
          typeof rawIde === "string" && rawIde.trim().length > 0
            ? rawIde.trim()
            : undefined;

        const folderPaths = parseFoldersFromFormData(formData);
        const isSettings = formData.get("add-to-settings") !== null;
        const isSkills = formData.get("agent-skills") !== null;

        const response = await window.electron.invoke.createTask({
          name,
          projectId,
          folderPaths,
          ide,
          isSettings: isSettings,
          isSkills: isSkills ? true : undefined,
        });

        if (response !== undefined) {
          closeModal();
          onSuccess(response);
        }

        return undefined;
      },
      [closeModal, onSuccess, projectId],
    ),
    undefined,
  );

  const handleClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <Popup
      title="Create a new task"
      description="Set the task name for this project."
      isOpen={isOpen && projectId !== undefined}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Create Task"
      confirmPendingLabel="Creating..."
      formTestId="create-task-form"
      messageTestId="create-task-message"
      content={<Fields />}
    />
  );
});

CreateTaskModal.displayName = "CreateTaskModal";
