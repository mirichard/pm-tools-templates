export type AsanaTemplate = {
  name: string;
  notes?: string;
  tasks?: { name: string; notes?: string; }[];
};

export type DeployOptions = {
  dryRun?: boolean;
  workspace?: string; // gid
};

