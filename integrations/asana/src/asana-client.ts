import { ApiClient, WorkspacesApi, ProjectsApi, TasksApi, CustomFieldsApi } from 'asana';
import type { AsanaConnectorConfig } from './connector';

type Data = Record<string, any>;
type Callback = (error: any, data: Data, response?: any) => void;

// Adapt the installed v2 SDK's callback API to the connector's promise API.
export function createAsanaClient(config: AsanaConnectorConfig) {
  const apiClient = new ApiClient();
  apiClient.authentications.oauth2.accessToken = config.accessToken;
  apiClient.defaultHeaders['asana-enable'] = 'new_user_task_lists,new_project_templates';
  apiClient.timeout = config.requestTimeout ?? 30000;
  const workspaces = new WorkspacesApi(apiClient);
  const projects = new ProjectsApi(apiClient);
  const tasks = new TasksApi(apiClient);
  const customFields = new CustomFieldsApi(apiClient);

  function call(invoke: (callback: Callback) => void): Promise<Data> {
    return new Promise((resolve, reject) => {
      let retries = config.rateLimitRetries ?? 3;
      const attempt = () => {
        try {
          invoke((error, data, response) => {
            if (error && response?.status === 429 && retries > 0) {
              retries -= 1;
              const seconds = Number(response.headers?.['retry-after']);
              const delay = Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : 1000;
              setTimeout(attempt, delay);
            } else if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          });
        } catch (error) {
          reject(error);
        }
      };
      attempt();
    });
  }

  return {
    apiClient,
    workspaces: {
      getWorkspace: (id: string) =>
        call((cb) => workspaces.getWorkspace(id, {}, cb)).then((r) => r.data),
      getWorkspaces: () => call((cb) => workspaces.getWorkspaces({}, cb)),
    },
    projects: {
      createProject: (data: Data) =>
        call((cb) => projects.createProject({ data }, {}, cb)).then((r) => r.data),
      addCustomFieldSettingForProject: (id: string, data: Data) =>
        call((cb) => projects.addCustomFieldSettingForProject({ data }, id, cb)).then(
          (r) => r.data
        ),
    },
    tasks: {
      createTask: (data: Data) =>
        call((cb) => tasks.createTask({ data }, {}, cb)).then((r) => r.data),
      updateTask: (id: string, data: Data) =>
        call((cb) => tasks.updateTask({ data }, id, {}, cb)).then((r) => r.data),
      getTasksForProject: (id: string, opts: Data) =>
        call((cb) =>
          tasks.getTasksForProject(
            id,
            {
              ...opts,
              opt_fields:
                typeof opts.opt_fields === 'string' ? opts.opt_fields.split(',') : opts.opt_fields,
            },
            cb
          )
        ),
    },
    customFields: {
      getCustomField: (id: string) =>
        call((cb) => customFields.getCustomField(id, {}, cb)).then((r) => r.data),
      getCustomFieldsForWorkspace: (id: string) =>
        call((cb) => customFields.getCustomFieldsForWorkspace(id, {}, cb)),
      createCustomField: (data: Data) =>
        call((cb) => customFields.createCustomField({ data }, {}, cb)).then((r) => r.data),
    },
  };
}
