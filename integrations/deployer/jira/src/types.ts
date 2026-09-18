export type JiraTemplate = {
  name: string;
  key: string; // 2-10 uppercase letters
  issueTypes?: string[]; // minimal seed
};

export type DeployOptions = {
  dryRun?: boolean;
  cloudId?: string;
  projectTypeKey?: 'software' | 'service_desk' | 'business';
};

