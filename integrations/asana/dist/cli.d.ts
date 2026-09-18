#!/usr/bin/env node
declare class AsanaCLI {
    private config;
    private connector?;
    private syncEngine?;
    private webhookServer?;
    constructor();
    private loadConfig;
    private saveConfig;
    private initializeConnector;
    private initializeSyncEngine;
    configure(): Promise<void>;
    listWorkspaces(): Promise<void>;
    listTeams(workspaceId?: string): Promise<void>;
    listTemplates(): Promise<void>;
    createProject(): Promise<void>;
    startSync(): Promise<void>;
    listSyncJobs(): Promise<void>;
    startWebhookServer(): Promise<void>;
    private getStatusColor;
    /**
     * Sanitize input for log output to prevent log injection attacks
     */
    private sanitizeLogInput;
    generateTemplate(): Promise<void>;
}
export default AsanaCLI;
//# sourceMappingURL=cli.d.ts.map