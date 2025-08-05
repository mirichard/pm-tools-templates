# MPP-Jira Integration Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the MPP-Jira integration framework for operations quarterly planning workflows.

## Prerequisites

### Microsoft Project Requirements
- Microsoft Project 2016 or later
- Ability to export to XML format
- Administrative access to configure custom fields

### Jira Requirements
- Jira Software (Cloud or Server)
- Administrator permissions
- Automation for Jira app (if using automation rules)
- CSV Importer app or equivalent

### Technical Requirements
- Python 3.7 or later
- Network access between systems
- File sharing or webhook capabilities

## Phase 1: Microsoft Project Setup

### 1.1 Configure Custom Fields

1. **Open Microsoft Project**
2. **Navigate to Field Configuration**
   - Go to **Project > Custom Fields**
   - Or right-click on any column header and select "Insert Column"

3. **Create Required Custom Fields**

   | Field Type | Field Number | Rename To | Purpose |
   |------------|--------------|-----------|----------|
   | Text1 | Text1 | Jira_Epic_Key | Existing Epic identifier |
   | Text2 | Text2 | Jira_Story_Key | Existing Story identifier |
   | Text3 | Text3 | Jira_Issue_Type | Issue type (Epic/Story/Task) |
   | Text4 | Text4 | Jira_Priority | Priority level |
   | Text5 | Text5 | Jira_Labels | Comma-separated labels |
   | Text6 | Text6 | Jira_Sprint | Target sprint |
   | Text7 | Text7 | Jira_Assignee | Assigned team member |
   | Text8 | Text8 | Jira_Component | Jira component |
   | Number1 | Number1 | Jira_Story_Points | Story point estimation |
   | Flag1 | Flag1 | Export_Flag | Include in export (Yes/No) |

4. **Configure Field Properties**
   - Set appropriate value lists for Priority, Issue Type
   - Configure default values where appropriate
   - Set field formulas if needed

### 1.2 Create Project Template

1. **Create New Project**
   - File > New > Blank Project

2. **Set Up Project Structure**
   ```
   Operations Q1 2024
   ├── [EPIC] Infrastructure Maintenance
   │   ├── [STORY] Server Updates
   │   │   ├── Update Production Servers
   │   │   └── Update Development Servers
   │   └── [STORY] Network Optimization
   ├── [EPIC] Application Deployments
   │   ├── [STORY] CRM System Update
   │   └── [STORY] Reporting Platform Enhancement
   └── [EPIC] Security Reviews
       ├── [STORY] Quarterly Security Audit
       └── [STORY] Access Control Review
   ```

3. **Populate Custom Fields**
   - Set Jira_Issue_Type for each level
   - Configure Export_Flag = Yes for items to sync
   - Fill in other relevant fields

4. **Save as Template**
   - File > Save As
   - Choose "Template" as file type
   - Save to organization template location

## Phase 2: Export Script Setup

### 2.1 Install Python Dependencies

```bash
# Create virtual environment
python -m venv mpp-jira-env
source mpp-jira-env/bin/activate  # On Windows: mpp-jira-env\Scripts\activate

# Install required packages
pip install lxml xmltodict pandas openpyxl
```

### 2.2 Configure Export Script

1. **Download Export Script**
   - Copy `mpp_to_jira_export.py` to your local system
   - Make executable: `chmod +x mpp_to_jira_export.py`

2. **Test Export Process**
   ```bash
   # Export MPP project to XML first
   # In Microsoft Project: File > Export > XML Format
   
   # Run export script
   python mpp_to_jira_export.py --input project.xml --output jira_import.csv --verbose
   ```

3. **Validate Output**
   - Check CSV format matches Jira import requirements
   - Verify field mappings are correct
   - Test with small dataset first

## Phase 3: Jira Configuration

### 3.1 Configure Custom Fields

1. **Navigate to Field Configuration**
   - Go to **Settings > Issues > Custom Fields**

2. **Create Required Fields**

   | Field Name | Type | Description | Context |
   |------------|------|-------------|----------|
   | External ID | Text Field (single line) | MPP task identifier | All issue types |
   | Start Date | Date Picker | Planned start date | All issue types |
   | MPP Duration | Text Field (single line) | Original duration estimate | All issue types |
   | Progress | Number Field | Completion percentage | All issue types |

3. **Configure Field Contexts**
   - Associate fields with appropriate issue types
   - Set default values where needed
   - Configure field permissions

### 3.2 Set Up Import Process

#### Option A: Manual CSV Import

1. **Install CSV Importer**
   - Go to **Atlassian Marketplace**
   - Install "CSV Importer" app

2. **Configure Import Mapping**
   - Map CSV columns to Jira fields
   - Test with sample data
   - Save import configuration

#### Option B: Automated Import (Advanced)

1. **Set Up Webhook Endpoint**
   ```python
   # Example Flask webhook receiver
   from flask import Flask, request, jsonify
   import csv
   from jira import JIRA
   
   app = Flask(__name__)
   
   @app.route('/mpp-import', methods=['POST'])
   def handle_mpp_import():
       # Process uploaded CSV
       # Create/update Jira issues
       return jsonify({'status': 'success'})
   ```

2. **Configure Jira API Access**
   - Create API token
   - Set up service account
   - Configure permissions

### 3.3 Configure Automation Rules

1. **Import Automation Rules**
   - Use configurations from `jira-automation/README.md`
   - Customize for your project needs
   - Test each rule individually

2. **Set Up Monitoring**
   - Enable automation logs
   - Configure error notifications
   - Set up performance monitoring

## Phase 4: Integration Testing

### 4.1 Test Scenarios

1. **Basic Import Test**
   - Create simple MPP with 2-3 tasks
   - Export and import to Jira
   - Verify all fields are populated

2. **Hierarchy Test**
   - Create Epic > Story > Task structure
   - Verify parent-child relationships
   - Check Epic linking

3. **Update Test**
   - Modify existing MPP
   - Re-import and verify updates
   - Check for duplicates

4. **Quarterly Workflow Test**
   - Simulate quarterly planning cycle
   - Update dates and resources
   - Re-import and validate changes

### 4.2 Performance Testing

1. **Volume Testing**
   - Test with realistic data volumes
   - Monitor import times
   - Check system performance

2. **Stress Testing**
   - Test concurrent imports
   - Validate error handling
   - Monitor system resources

## Phase 5: Production Deployment

### 5.1 Production Setup

1. **Environment Configuration**
   - Set up production Jira instance
   - Configure backup procedures
   - Implement monitoring

2. **User Training**
   - Train PMs on MPP template usage
   - Document export/import procedures
   - Create troubleshooting guides

3. **Go-Live Checklist**
   - [ ] All custom fields configured
   - [ ] Automation rules tested
   - [ ] Import process validated
   - [ ] User training completed
   - [ ] Monitoring in place
   - [ ] Rollback plan ready

### 5.2 Ongoing Operations

1. **Quarterly Process**
   - Update MPP with new dates/resources
   - Run export script
   - Import to Jira
   - Validate and communicate changes

2. **Monitoring and Maintenance**
   - Monitor automation rule performance
   - Review import logs regularly
   - Update field mappings as needed
   - Maintain script dependencies

## Troubleshooting

### Common Issues

1. **Export Failures**
   - Check MPP XML export format
   - Verify custom field configuration
   - Validate data types

2. **Import Errors**
   - Check CSV format and encoding
   - Verify field mappings
   - Check Jira permissions

3. **Automation Issues**
   - Review automation logs
   - Check trigger conditions
   - Validate webhook endpoints

### Support Resources

- **Documentation**: See `docs/` folder for detailed guides
- **Scripts**: Available in `export-scripts/` folder
- **Templates**: MPP templates in `mpp-template/` folder
- **Automation**: Jira rules in `jira-automation/` folder

## Best Practices

1. **Data Management**
   - Maintain consistent naming conventions
   - Regular data validation
   - Backup before major imports

2. **Process Management**
   - Document all configuration changes
   - Test in staging environment first
   - Communicate changes to stakeholders

3. **Security**
   - Use service accounts for automation
   - Implement proper access controls
   - Regular security reviews

## Next Steps

After successful setup:
1. Schedule quarterly planning sessions
2. Implement feedback collection
3. Plan for additional integrations
4. Consider advanced reporting capabilities

