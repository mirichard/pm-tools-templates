"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsanaClient = createAsanaClient;
const asana_1 = require("asana");
// Adapt the installed v2 SDK's callback API to the connector's promise API.
function createAsanaClient(config) {
    const apiClient = new asana_1.ApiClient();
    apiClient.authentications.oauth2.accessToken = config.accessToken;
    apiClient.defaultHeaders['asana-enable'] = 'new_user_task_lists,new_project_templates';
    apiClient.timeout = config.requestTimeout ?? 30000;
    const workspaces = new asana_1.WorkspacesApi(apiClient);
    const projects = new asana_1.ProjectsApi(apiClient);
    const tasks = new asana_1.TasksApi(apiClient);
    const customFields = new asana_1.CustomFieldsApi(apiClient);
    function call(invoke) {
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
                        }
                        else if (error) {
                            reject(error);
                        }
                        else {
                            resolve(data);
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            };
            attempt();
        });
    }
    return {
        apiClient,
        workspaces: {
            getWorkspace: (id) => call((cb) => workspaces.getWorkspace(id, {}, cb)).then((r) => r.data),
            getWorkspaces: () => call((cb) => workspaces.getWorkspaces({}, cb)),
        },
        projects: {
            createProject: (data) => call((cb) => projects.createProject({ data }, {}, cb)).then((r) => r.data),
            addCustomFieldSettingForProject: (id, data) => call((cb) => projects.addCustomFieldSettingForProject({ data }, id, cb)).then((r) => r.data),
        },
        tasks: {
            createTask: (data) => call((cb) => tasks.createTask({ data }, {}, cb)).then((r) => r.data),
            updateTask: (id, data) => call((cb) => tasks.updateTask({ data }, id, {}, cb)).then((r) => r.data),
            getTasksForProject: (id, opts) => call((cb) => tasks.getTasksForProject(id, {
                ...opts,
                opt_fields: typeof opts.opt_fields === 'string' ? opts.opt_fields.split(',') : opts.opt_fields,
            }, cb)),
        },
        customFields: {
            getCustomField: (id) => call((cb) => customFields.getCustomField(id, {}, cb)).then((r) => r.data),
            getCustomFieldsForWorkspace: (id) => call((cb) => customFields.getCustomFieldsForWorkspace(id, {}, cb)),
            createCustomField: (data) => call((cb) => customFields.createCustomField({ data }, {}, cb)).then((r) => r.data),
        },
    };
}
//# sourceMappingURL=asana-client.js.map