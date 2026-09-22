import type { AsanaConnectorConfig } from './connector';
type Data = Record<string, any>;
export declare function createAsanaClient(config: AsanaConnectorConfig): {
    apiClient: any;
    workspaces: {
        getWorkspace: (id: string) => Promise<any>;
        getWorkspaces: () => Promise<Data>;
    };
    projects: {
        createProject: (data: Data) => Promise<any>;
        addCustomFieldSettingForProject: (id: string, data: Data) => Promise<any>;
    };
    tasks: {
        createTask: (data: Data) => Promise<any>;
        updateTask: (id: string, data: Data) => Promise<any>;
        getTasksForProject: (id: string, opts: Data) => Promise<Data>;
    };
    customFields: {
        getCustomField: (id: string) => Promise<any>;
        getCustomFieldsForWorkspace: (id: string) => Promise<Data>;
        createCustomField: (data: Data) => Promise<any>;
    };
};
export {};
//# sourceMappingURL=asana-client.d.ts.map