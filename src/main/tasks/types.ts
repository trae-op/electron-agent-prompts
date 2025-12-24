export type TGetFoldersContentByProjectId = {
  getFoldersContentByProjectId: (projectId?: string | undefined) =>
    | {
        [key: string]: string[] | undefined;
      }
    | undefined;
};
