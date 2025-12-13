import { memo, useActionState, useCallback } from "react";

import {
  useDeleteProjectModalProjectSelector,
  useSetDeleteProjectModalProjectDispatch,
} from "../context";
import { ConfirmModel } from "@composites/ConfirmModel";
import { TDeleteProjectModalProps } from "./types";

export const DeleteProjectModal = memo(
  ({ onSuccess }: TDeleteProjectModalProps) => {
    const project = useDeleteProjectModalProjectSelector();
    const setProject = useSetDeleteProjectModalProjectDispatch();

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, _formData: FormData): Promise<undefined> => {
          if (project?.id === undefined) {
            return undefined;
          }

          const response = await window.electron.invoke.deleteProject({
            id: project.id,
          });

          if (response === true) {
            onSuccess(project.id);
            setProject(undefined);
          }

          return undefined;
        },
        [project?.id]
      ),
      undefined
    );

    const handlerClose = useCallback(() => {
      setProject(undefined);
    }, []);

    return (
      <ConfirmModel
        title="Delete project"
        isOpen={project !== undefined}
        description={
          project !== undefined
            ? `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
            : ""
        }
        formAction={formAction}
        onClose={handlerClose}
        confirmLabel="Apply"
        confirmPendingLabel="Deleting..."
        confirmColor="error"
        formTestId="delete-project-form"
        messageTestId="delete-project-message"
      />
    );
  }
);

DeleteProjectModal.displayName = "DeleteProjectModal";
