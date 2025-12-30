export type TArchitectureNodeDraft = {
  id: string;
  name: string;
  children: TArchitectureNodeDraft[];
};

export type TArchitectureNode = {
  name: string;
  children: TArchitectureNode[];
};

export type TArchitectureNodeInput = {
  name: string;
  children?: TArchitectureNodeInput[];
};

export type TParsedArchitecture = {
  rootPath: string;
  nodes: TArchitectureNode[];
};
