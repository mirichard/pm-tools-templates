# Power BI Data Connection Guides

## 📊 Overview
Comprehensive guides for connecting Power BI to popular project management and enterprise data sources. These guides provide step-by-step instructions, authentication requirements, and best practices for each connection type.

## 🎯 Supported Data Sources

### 1. Microsoft Project Online/Project Server
### 2. Jira (Atlassian)
### 3. Azure DevOps (TFS)
### 4. SharePoint Lists
### 5. SQL Server/Azure SQL Database
### 6. Asana
### 7. Monday.com
### 8. Trello
### 9. Smartsheet
### 10. Excel/CSV Files

---

## 1. Microsoft Project Online Connection

### Prerequisites
- Microsoft Project Online license
- Power BI Premium or Pro license
- OData feed enabled in Project Online
- Appropriate permissions to project data

### Connection Steps
1. **Open Power BI Desktop**
2. **Get Data** → **OData Feed**
3. **Enter URL**: `https://[tenant].sharepoint.com/sites/pwa/_api/ProjectData`
4. **Authentication**: Use Organizational Account

### PowerQuery Code
```powerquery
let
    Source = OData.Feed("https://yourtenant.sharepoint.com/sites/pwa/_api/ProjectData"),
    Projects_table = Source{[Name="Projects"]}[Data],
    #"Expanded Project" = Table.ExpandRecordColumn(Projects_table, "Project", 
        {"ProjectName", "ProjectStartDate", "ProjectFinishDate", "ProjectCost", "ProjectPercentCompleted"})
in
    #"Expanded Project"
```

### Key Tables Available
- **Projects**: Project-level information
- **Tasks**: Task/activity details
- **Resources**: Resource assignments
- **Assignments**: Resource-task assignments
- **Timephased**: Time-distributed data

### Sample DAX Measures
```dax
// Project Completion Rate
Project Completion Rate = 
AVERAGE(Projects[ProjectPercentCompleted]) / 100

// Projects Behind Schedule
Projects Behind Schedule = 
COUNTROWS(
    FILTER(Projects, 
        Projects[ProjectFinishDate] > Projects[ProjectBaselineFinishDate] &&
        Projects[ProjectPercentCompleted] < 1
    )
)
```

---

## 2. Jira (Atlassian) Connection

### Prerequisites
- Jira administrator access or API permissions
- Jira API token or OAuth credentials
- Power BI Desktop with Web connector

### Authentication Setup
1. **Generate API Token**: Jira Profile → Security → API tokens
2. **Base64 Encode**: `email:token` combination
3. **Authorization Header**: `Basic [encoded-credentials]`

### Connection Steps
1. **Get Data** → **Web**
2. **URL**: `https://[domain].atlassian.net/rest/api/3/search?jql=project=[PROJECT-KEY]`
3. **Advanced Options** → **HTTP request header parameters**
4. **Add Header**: `Authorization: Basic [encoded-credentials]`

### PowerQuery Code
```powerquery
let
    // Jira API Base URL
    BaseUrl = "https://yourcompany.atlassian.net/rest/api/3/",
    
    // Authentication
    ApiToken = "your-api-token",
    Email = "your-email@company.com",
    Credentials = Text.ToBinary(Email & ":" & ApiToken),
    EncodedCredentials = Binary.ToText(Credentials, BinaryEncoding.Base64),
    
    // API Call
    Source = Json.Document(Web.Contents(BaseUrl & "search", [
        Headers = [
            #"Authorization" = "Basic " & EncodedCredentials,
            #"Accept" = "application/json"
        ],
        Query = [
            jql = "project = 'YOUR-PROJECT' ORDER BY created DESC",
            maxResults = "1000",
            fields = "summary,status,priority,assignee,created,updated,resolutiondate"
        ]
    ])),
    
    // Extract Issues
    Issues = Source[issues],
    #"Converted to Table" = Table.FromList(Issues, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", 
        {"key", "fields"}, {"IssueKey", "Fields"}),
    #"Expanded Fields" = Table.ExpandRecordColumn(#"Expanded Column1", "Fields", 
        {"summary", "status", "priority", "assignee", "created", "updated"})
in
    #"Expanded Fields"
```

### Key Metrics Available
- Issue counts by status, priority, assignee
- Cycle time and lead time calculations
- Sprint performance metrics
- Epic progress tracking

### Sample DAX Measures
```dax
// Average Cycle Time (in days)
Average Cycle Time = 
AVERAGEX(
    FILTER(Issues, NOT(ISBLANK(Issues[ResolutionDate]))),
    DATEDIFF(Issues[Created], Issues[ResolutionDate], DAY)
)

// Issues by Sprint
Issues This Sprint = 
COUNTROWS(
    FILTER(Issues, Issues[Sprint] = "Current Sprint")
)
```

---

## 3. Azure DevOps (TFS) Connection

### Prerequisites
- Azure DevOps organization access
- Personal Access Token (PAT) with read permissions
- Work item tracking enabled

### PAT Setup
1. **Azure DevOps** → **User Settings** → **Personal Access Tokens**
2. **New Token** with **Work Items (Read)** scope
3. **Copy token** for authentication

### Connection Steps
1. **Get Data** → **OData Feed**
2. **URL**: `https://analytics.dev.azure.com/[organization]/[project]/_odata/v3.0-preview/`
3. **Authentication**: Basic (leave username blank, use PAT as password)

### PowerQuery Code
```powerquery
let
    // Azure DevOps Analytics OData endpoint
    Source = OData.Feed("https://analytics.dev.azure.com/yourorg/yourproject/_odata/v3.0-preview/WorkItems", [
        Query = [
            #"$filter" = "WorkItemType eq 'User Story' or WorkItemType eq 'Task' or WorkItemType eq 'Bug'",
            #"$select" = "WorkItemId,Title,WorkItemType,State,Priority,CreatedDate,ChangedDate,ClosedDate"
        ]
    ]),
    #"Filtered Rows" = Table.SelectRows(Source, each [State] <> "Removed")
in
    #"Filtered Rows"
```

### Available Entities
- **WorkItems**: User stories, tasks, bugs
- **WorkItemRevisions**: Historical changes
- **Iterations**: Sprint information
- **Areas**: Team/area path data

### Sample DAX Measures
```dax
// Velocity (Story Points per Sprint)
Velocity = 
SUMX(
    FILTER(WorkItems, 
        WorkItems[WorkItemType] = "User Story" && 
        WorkItems[State] = "Done"
    ),
    WorkItems[StoryPoints]
)

// Bug Resolution Time
Avg Bug Resolution Time = 
AVERAGEX(
    FILTER(WorkItems, 
        WorkItems[WorkItemType] = "Bug" && 
        NOT(ISBLANK(WorkItems[ClosedDate]))
    ),
    DATEDIFF(WorkItems[CreatedDate], WorkItems[ClosedDate], DAY)
)
```

---

## 4. SharePoint Lists Connection

### Prerequisites
- SharePoint Online access
- List permissions (Read minimum)
- Modern SharePoint lists recommended

### Connection Steps
1. **Get Data** → **SharePoint Online List**
2. **Site URL**: `https://[tenant].sharepoint.com/sites/[site]`
3. **Authentication**: Microsoft Account
4. **Select Lists**: Choose your project tracking lists

### PowerQuery Code
```powerquery
let
    Source = SharePoint.Tables("https://yourcompany.sharepoint.com/sites/PMO", [ApiVersion = 15]),
    #"Projects List" = Source{[Name="Projects"]}[Data],
    #"Expanded Fields" = Table.ExpandRecordColumn(#"Projects List", "Fields", {
        "Title", "Status", "StartDate", "EndDate", "Budget", "ProjectManager", "Priority"
    }),
    #"Changed Type" = Table.TransformColumnTypes(#"Expanded Fields",{
        {"StartDate", type date},
        {"EndDate", type date},
        {"Budget", type number}
    })
in
    #"Changed Type"
```

### Best Practices
- Use **Choice** columns for consistent status values
- Enable **Version History** for audit trail
- Set up **Calculated Columns** for derived metrics
- Use **Lookup Columns** for relationships

### Sample DAX Measures
```dax
// Projects by Status
Projects On Track = 
COUNTROWS(FILTER(Projects, Projects[Status] = "On Track"))

// Budget Utilization
Budget Utilization = 
DIVIDE(SUM(Projects[ActualSpend]), SUM(Projects[Budget])) * 100
```

---

## 5. SQL Server/Azure SQL Database Connection

### Prerequisites
- SQL Server or Azure SQL Database access
- Database connection credentials
- Read permissions on required tables
- Network connectivity (VPN if on-premises)

### Connection Steps
1. **Get Data** → **SQL Server Database**
2. **Server**: Server name or Azure SQL endpoint
3. **Database**: Database name (optional)
4. **Data Connectivity Mode**: Import or DirectQuery
5. **Authentication**: Windows or Database credentials

### PowerQuery Code
```powerquery
let
    Source = Sql.Database("your-server.database.windows.net", "ProjectDB", [
        Query = "
        SELECT 
            p.ProjectID,
            p.ProjectName,
            p.Status,
            p.StartDate,
            p.EndDate,
            p.Budget,
            p.ActualCost,
            pm.ManagerName,
            pt.TypeName as ProjectType
        FROM Projects p
        LEFT JOIN ProjectManagers pm ON p.ManagerID = pm.ManagerID
        LEFT JOIN ProjectTypes pt ON p.TypeID = pt.TypeID
        WHERE p.IsActive = 1
        "
    ])
in
    Source
```

### Performance Optimization
```sql
-- Create indexes for better performance
CREATE INDEX IX_Projects_Status ON Projects(Status);
CREATE INDEX IX_Projects_StartDate ON Projects(StartDate);
CREATE INDEX IX_Tasks_ProjectID ON Tasks(ProjectID);

-- Use views for complex joins
CREATE VIEW vw_ProjectSummary AS
SELECT 
    p.ProjectID,
    p.ProjectName,
    COUNT(t.TaskID) as TaskCount,
    AVG(t.PercentComplete) as AvgCompletion
FROM Projects p
LEFT JOIN Tasks t ON p.ProjectID = t.ProjectID
GROUP BY p.ProjectID, p.ProjectName;
```

---

## 6. Asana Connection

### Prerequisites
- Asana account with project access
- Personal Access Token from Asana
- Power BI Desktop with Web connector

### Authentication Setup
1. **Asana** → **My Profile Settings** → **Apps** → **Manage Developer Apps**
2. **Create New Personal Access Token**
3. **Copy Token** for API authentication

### Connection Steps
1. **Get Data** → **Web**
2. **URL**: `https://app.asana.com/api/1.0/projects/[PROJECT-ID]/tasks`
3. **Advanced** → **HTTP request header parameters**
4. **Authorization**: `Bearer [your-token]`

### PowerQuery Code
```powerquery
let
    // Asana API Configuration
    BaseUrl = "https://app.asana.com/api/1.0/",
    AccessToken = "your-personal-access-token",
    
    // Get Projects
    ProjectsResponse = Json.Document(Web.Contents(BaseUrl & "projects", [
        Headers = [
            #"Authorization" = "Bearer " & AccessToken,
            #"Accept" = "application/json"
        ]
    ])),
    
    Projects = ProjectsResponse[data],
    #"Projects to Table" = Table.FromList(Projects, Splitter.SplitByNothing()),
    #"Expanded Projects" = Table.ExpandRecordColumn(#"Projects to Table", "Column1", 
        {"gid", "name", "color", "created_at", "modified_at"})
in
    #"Expanded Projects"
```

### Available Data
- **Projects**: Project information and metadata
- **Tasks**: Task details, assignees, due dates
- **Users**: Team member information
- **Teams**: Organizational structure

---

## 7. Monday.com Connection

### Prerequisites
- Monday.com account with board access
- API token from Monday.com developer settings
- Board IDs for the data you want to connect

### Authentication Setup
1. **Monday.com** → **Profile** → **Admin** → **API**
2. **Generate API Token**
3. **Copy Token** and note Board IDs

### PowerQuery Code
```powerquery
let
    // Monday.com GraphQL API
    ApiToken = "your-api-token",
    
    // GraphQL Query
    Query = "{
        boards(ids: [123456789]) {
            name
            items {
                id
                name
                state
                created_at
                updated_at
                column_values {
                    id
                    text
                    title
                }
            }
        }
    }",
    
    // API Request
    Source = Json.Document(Web.Contents("https://api.monday.com/v2", [
        Headers = [
            #"Authorization" = ApiToken,
            #"Content-Type" = "application/json"
        ],
        Content = Text.ToBinary("{""query"":""" & Query & """}")
    ])),
    
    // Extract Data
    Data = Source[data][boards]{0}[items],
    #"Converted to Table" = Table.FromList(Data, Splitter.SplitByNothing()),
    #"Expanded Items" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", 
        {"id", "name", "state", "created_at", "updated_at", "column_values"})
in
    #"Expanded Items"
```

---

## 8. Performance Optimization Best Practices

### Data Source Optimization
1. **Use Views/Queries**: Pre-aggregate data at source
2. **Index Key Columns**: Ensure filtering columns are indexed
3. **Limit Data Range**: Use date filters to reduce data volume
4. **Column Selection**: Only import required columns

### Power BI Optimization
1. **DirectQuery vs Import**: Choose based on data freshness needs
2. **Incremental Refresh**: For large historical datasets
3. **Data Types**: Use appropriate data types to reduce memory
4. **Relationships**: Create proper relationships between tables

### Query Folding
```powerquery
// Good - Query folding enabled
let
    Source = Sql.Database("server", "database"),
    Projects = Source{[Schema="dbo",Item="Projects"]}[Data],
    #"Filtered Rows" = Table.SelectRows(Projects, each [Status] = "Active"),
    #"Changed Type" = Table.TransformColumnTypes(#"Filtered Rows", {{"StartDate", type date}})
in
    #"Changed Type"

// Avoid - Query folding disabled
let
    Source = Sql.Database("server", "database"),
    Projects = Source{[Schema="dbo",Item="Projects"]}[Data],
    #"Added Custom" = Table.AddColumn(Projects, "Custom", each Text.Upper([ProjectName])),
    #"Filtered Rows" = Table.SelectRows(#"Added Custom", each [Status] = "Active")
in
    #"Filtered Rows"
```

## 9. Troubleshooting Common Issues

### Authentication Problems
- **Token Expiry**: Refresh API tokens regularly
- **Permissions**: Verify read access to all required data
- **Network**: Check firewall and proxy settings

### Performance Issues
- **Large Datasets**: Implement incremental refresh
- **Complex Relationships**: Simplify data model
- **Multiple Sources**: Consider data consolidation

### Data Quality Issues
- **Missing Values**: Implement null handling
- **Data Types**: Ensure consistent typing across sources
- **Duplicate Records**: Add deduplication logic

## 10. Security Considerations

### Data Protection
- **Row-Level Security**: Implement user-based filtering
- **Column-Level Security**: Hide sensitive information
- **Data Classification**: Mark sensitive data appropriately

### Connection Security
- **Encrypted Connections**: Use HTTPS/TLS for all connections
- **Credential Management**: Use secure credential storage
- **Regular Audits**: Monitor data access patterns

---

**Document Version**: 1.0  
**Last Updated**: August 3, 2025  
**Compatibility**: Power BI Desktop 2.120+  
**Created By**: Enterprise Executive Dashboard Suite - Issue #327
