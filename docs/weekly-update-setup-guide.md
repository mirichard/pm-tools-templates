# 📊 Weekly Project Update System - Setup & Configuration Guide

## Overview

The Weekly Project Update system is an automated template-based solution for generating consistent project status reports. This system creates standardized weekly updates with automatic date generation and optional automation features.

## 🚀 Quick Start

### Prerequisites
- macOS or Linux system
- Bash shell
- Basic command line familiarity
- Text editor (VS Code, Vim, etc.)

### Initial Setup
1. Navigate to the pm-tools-templates directory
2. Run the generation script manually to test
3. Optionally set up automation

```bash
cd pm-tools-templates/scripts
./generate-weekly-update.sh
```

## 📁 File Structure

```
pm-tools-templates/
├── weekly-project-update.md          # Main template file
├── scripts/
│   ├── generate-weekly-update.sh     # Generation script
│   └── setup-weekly-cron.sh          # Automation setup
├── reports/
│   └── weekly-updates/               # Generated reports location
└── docs/
    └── weekly-update-setup-guide.md  # This documentation
```

## 🛠️ Setup Process

### Step 1: Verify File Structure
Ensure all required files are in place:

```bash
ls -la pm-tools-templates/
ls -la pm-tools-templates/scripts/
```

### Step 2: Make Scripts Executable
```bash
chmod +x pm-tools-templates/scripts/generate-weekly-update.sh
chmod +x pm-tools-templates/scripts/setup-weekly-cron.sh
```

### Step 3: Test Manual Generation
```bash
cd pm-tools-templates/scripts
./generate-weekly-update.sh
```

This will:
- Create the reports directory if it doesn't exist
- Generate a weekly update with today's date
- Attempt to open the file in your default editor

### Step 4: Set Up Automation (Optional)
```bash
cd pm-tools-templates/scripts
./setup-weekly-cron.sh
```

This installs a cron job that runs every Monday at 7:00 AM Eastern.

## ⚙️ Configuration Options

### Template Customization

The main template file (`weekly-project-update.md`) can be customized by editing:

#### 1. Header Section
```markdown
# 📊 PM Tools Templates - Weekly Project Update
Week of: $(date +"%B %d, %Y")
```

#### 2. Section Structure
Current sections:
- 🔄 In-Progress Items
- 🎯 Next on Roadmap
- 📈 This Week's Progress
- 🚧 Blockers/Issues
- 📋 Completed This Week
- 📊 Key Metrics
- 🔮 Looking Ahead

#### 3. Default Content
Update the default items, metrics, and placeholders to match your project needs.

### Script Configuration

#### Generation Script Variables
The script automatically detects paths relative to its location, but you can customize:

```bash
# These paths are set automatically by the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE_PATH="$PROJECT_ROOT/weekly-project-update.md"
OUTPUT_DIR="$PROJECT_ROOT/reports/weekly-updates"
```

#### Automation Timing
Edit `setup-weekly-cron.sh` to change the schedule:

```bash
CRON_ENTRY="0 7 * * 1 $SCRIPT_PATH"  # Monday 7AM
```

Cron format: `minute hour day month day-of-week`
- `0 7 * * 1` = Monday at 7:00 AM
- `0 9 * * 1` = Monday at 9:00 AM
- `0 7 * * 5` = Friday at 7:00 AM

## 🎨 Customization Examples

### Adding New Sections

1. Edit the template file:
```bash
nano weekly-project-update.md
```

2. Add new sections:
```markdown
## 🎯 Sprint Goals:
- Goal 1
- Goal 2

## 📞 Stakeholder Updates:
- Meeting with Client A
- Demo scheduled for Friday
```

### Customizing Date Format

Change the date format in the template:
```bash
# Current format: "July 14, 2025"
$(date +"%B %d, %Y")

# Alternative formats:
$(date +"%Y-%m-%d")           # "2025-07-14"
$(date +"%b %d, %Y")          # "Jul 14, 2025"
$(date +"%A, %B %d, %Y")      # "Monday, July 14, 2025"
```

### Adding Project-Specific Items

Edit the template to include your specific project items:

```markdown
## 🔄 In-Progress Items:
- #103: UX-101: Interactive Getting Started Tutorial
- #106: FEAT-202: User Authentication System
- #107: BUG-045: Dashboard Loading Performance

## 🎯 Next on Roadmap:
- #105: AI-101: Monte Carlo Schedule Forecasting Engine
- #104: UX-201: Unified Search Across All Documentation
- #108: INFRA-301: Migration to Cloud Infrastructure
```

### Output Directory Customization

Change where reports are saved by modifying the script:

```bash
# In generate-weekly-update.sh - modify the OUTPUT_DIR variable
OUTPUT_DIR="$PROJECT_ROOT/reports/weekly-updates"  # Default

# Alternative locations:
OUTPUT_DIR="$HOME/Documents/Project-Reports"
OUTPUT_DIR="$PROJECT_ROOT/reports/$(date +%Y)"
```

## 🔧 Advanced Configuration

### Multi-Project Support

Create project-specific templates:

```bash
# Create project-specific templates
cp weekly-project-update.md weekly-update-project-a.md
cp weekly-project-update.md weekly-update-project-b.md

# Modify generation script for project selection
./generate-weekly-update.sh project-a
./generate-weekly-update.sh project-b
```

### Email Integration

Add email sending to the generation script:

```bash
# Add to generate-weekly-update.sh
EMAIL_RECIPIENTS="team@company.com"
SUBJECT="Weekly Project Update - $(date +'%B %d, %Y')"

# Send email (requires mail command or sendmail)
mail -s "$SUBJECT" "$EMAIL_RECIPIENTS" < "$OUTPUT_FILE"
```

### Git Integration

Auto-commit generated reports:

```bash
# Add to generate-weekly-update.sh
cd "$PROJECT_ROOT"
git add "reports/weekly-updates/Weekly-Update-$DATE_STAMP.md"
git commit -m "Add weekly update for $(date +'%B %d, %Y')"
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Permission Denied
```bash
chmod +x pm-tools-templates/scripts/*.sh
```

#### 2. Cron Job Not Running
```bash
# Check cron service status
crontab -l

# View cron logs
grep CRON /var/log/system.log
```

#### 3. Date Not Expanding
Ensure the template uses proper bash command substitution:
```bash
# Correct
$(date +"%B %d, %Y")

# Incorrect
`date +"%B %d, %Y"`
```

#### 4. File Not Opening in Editor
The script tries editors in this order:
1. VS Code (`code`)
2. Vim (`vim`)
3. Manual edit message

To add your preferred editor:
```bash
# Edit generate-weekly-update.sh
if command -v atom &> /dev/null; then
    atom "$OUTPUT_FILE"
elif command -v code &> /dev/null; then
    code "$OUTPUT_FILE"
```

### Log Files

Create logging for debugging:

```bash
# Add to generate-weekly-update.sh
LOG_FILE="$PROJECT_ROOT/logs/weekly-update.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "$(date): Weekly update generated: $OUTPUT_FILE" >> "$LOG_FILE"
```

## 📋 Maintenance

### Regular Tasks

1. **Review and update template** - Monthly
2. **Check automation logs** - Weekly
3. **Archive old reports** - Quarterly
4. **Update project items** - As needed

### Backup Strategy

```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="$HOME/Backups/pm-tools-templates"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$BACKUP_DIR"
cp -r "$PROJECT_ROOT" "$BACKUP_DIR/$(date +%Y-%m-%d)"
```

## 🚀 Next Steps

1. Test the system thoroughly
2. Customize template for your specific needs
3. Set up automation if desired
4. Train team members on usage
5. Establish review and update processes

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Test scripts manually
4. Verify file permissions and paths

---

*Generated: $(date +"%B %d, %Y")*
