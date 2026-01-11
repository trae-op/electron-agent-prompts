export type TGetFoldersContentByProjectId = {
  getFoldersContentByProjectId: (projectId?: string | undefined) =>
    | {
        [key: string]: string[] | undefined;
      }
    | undefined;
  getConnectionInstructionByProjectId: (projectId?: string | undefined) =>
    | {
        [key: string]: { ide?: string; isSkills?: boolean } | undefined;
      }
    | undefined;
};
