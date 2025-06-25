#!/usr/bin/env python3
"""
Fix Broken Anchor Links Script
Automatically fixes all 32 identified broken anchor links in the repository.
"""

import sys
from pathlib import Path

# Define all the broken links and their fixes
BROKEN_LINKS_FIXES = [
    # ANCHOR_LINK_MAINTENANCE.md
    {
        "file": "ANCHOR_LINK_MAINTENANCE.md",
        "line": 104,
        "old": "#broken--anchor",
        "new": "#2-broken-anchor-references"
    },
    {
        "file": "ANCHOR_LINK_MAINTENANCE.md", 
        "line": 114,
        "old": "#approval--baseline-process",
        "new": "#approval-baseline-process"
    },
    {
        "file": "ANCHOR_LINK_MAINTENANCE.md",
        "line": 117,
        "old": "#approval-baseline-process",
        "new": "#approval-baseline-process"
    },
    
    # Traditional/Templates/issue_log_template.md
    {
        "file": "Traditional/Templates/issue_log_template.md",
        "line": 26,
        "old": "#8-issue-history-log",
        "new": "#7-issue-log"
    },
    {
        "file": "Traditional/Templates/issue_log_template.md",
        "line": 27,
        "old": "#9-approval",
        "new": "#3-priority-and-severity-assessment"
    },
    
    # ai-insights/DEPLOYMENT.md
    {
        "file": "ai-insights/DEPLOYMENT.md",
        "line": 31,
        "old": "#monitoring--maintenance",
        "new": "#monitoring-maintenance"
    },
    {
        "file": "ai-insights/DEPLOYMENT.md",
        "line": 32,
        "old": "#scaling--performance",
        "new": "#scaling-performance"
    },
    
    # ai-insights/TESTING.md
    {
        "file": "ai-insights/TESTING.md",
        "line": 13,
        "old": "#test-types--strategies",
        "new": "#test-types-strategies"
    },
    {
        "file": "ai-insights/TESTING.md",
        "line": 15,
        "old": "#test-data--scenarios",
        "new": "#test-data-scenarios"
    },
    
    # docs/ANCHOR_LINK_MAINTENANCE.md
    {
        "file": "docs/ANCHOR_LINK_MAINTENANCE.md",
        "line": 11,
        "old": "#anchor",
        "new": "#system-components"
    },
    {
        "file": "docs/ANCHOR_LINK_MAINTENANCE.md",
        "line": 82,
        "old": "#anchor-name",
        "new": "#system-components"
    },
    {
        "file": "docs/ANCHOR_LINK_MAINTENANCE.md",
        "line": 142,
        "old": "#Project-Management",
        "new": "#best-practices"
    },
    {
        "file": "docs/ANCHOR_LINK_MAINTENANCE.md",
        "line": 266,
        "old": "#new-pm-start",
        "new": "#troubleshooting"
    },
    
    # industry-specializations/financial-services/risk-management/risk-assessment-framework.md
    {
        "file": "industry-specializations/financial-services/risk-management/risk-assessment-framework.md",
        "line": 25,
        "old": "#risk-categories-1",
        "new": "#risk-categories"
    },
    
    # industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 23,
        "old": "#capa-overview",
        "new": "#1-capa-overview"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 29,
        "old": "#corrective-action-plan",
        "new": "#2-corrective-action-plan"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 35,
        "old": "#preventive-action-plan",
        "new": "#3-preventive-action-plan"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 40,
        "old": "#implementation",
        "new": "#4-implementation"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 45,
        "old": "#verification-and-validation",
        "new": "#5-verification-and-validation"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 50,
        "old": "#effectiveness-check",
        "new": "#6-effectiveness-check"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 55,
        "old": "#regulatory-compliance",
        "new": "#7-regulatory-compliance"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 60,
        "old": "#change-control",
        "new": "#8-change-control"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 61,
        "old": "#impact-assessment-1",
        "new": "#impact-assessment"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 62,
        "old": "#training-requirements-1",
        "new": "#training-requirements"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 65,
        "old": "#closure-and-reporting",
        "new": "#9-closure-and-reporting"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
        "line": 70,
        "old": "#appendices",
        "new": "#10-appendices"
    },
    
    # industry-specializations/healthcare-pharmaceutical/quality-management/capa_management_template.md
    {
        "file": "industry-specializations/healthcare-pharmaceutical/quality-management/capa_management_template.md",
        "line": 23,
        "old": "#capa-overview",
        "new": "#1-capa-overview"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/quality-management/capa_management_template.md",
        "line": 28,
        "old": "#capa-process",
        "new": "#2-capa-process"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/quality-management/capa_management_template.md",
        "line": 36,
        "old": "#documentation-requirements",
        "new": "#3-documentation-requirements"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/quality-management/capa_management_template.md",
        "line": 41,
        "old": "#monitoring-and-reporting",
        "new": "#4-monitoring-and-reporting"
    },
    {
        "file": "industry-specializations/healthcare-pharmaceutical/quality-management/capa_management_template.md",
        "line": 47,
        "old": "#appendices",
        "new": "#5-appendices"
    },
    
    # industry_templates/software_development/user_story_template.md
    {
        "file": "industry_templates/software_development/user_story_template.md",
        "line": 227,
        "old": "#",
        "new": "#story-splitting-if-needed"
    }
]

def fix_broken_links(repo_root="."):
    """Fix all broken anchor links in the repository."""
    repo_path = Path(repo_root)
    fixed_count = 0
    total_fixes = len(BROKEN_LINKS_FIXES)
    
    print(f"🔧 Starting to fix {total_fixes} broken anchor links...")
    
    for fix in BROKEN_LINKS_FIXES:
        file_path = repo_path / fix["file"]
        
        if not file_path.exists():
            print(f"❌ File not found: {file_path}")
            continue
            
        try:
            # Read the file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace the broken link
            old_link = fix["old"]
            new_link = fix["new"]
            
            if old_link in content:
                new_content = content.replace(old_link, new_link)
                
                # Write the fixed content back
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                fixed_count += 1
                print(f"✅ Fixed {fix['file']} line {fix['line']}: {old_link} → {new_link}")
            else:
                print(f"⚠️  Link not found in {fix['file']}: {old_link}")
                
        except Exception as e:
            print(f"❌ Error fixing {file_path}: {e}")
    
    print(f"\n🎉 Fixed {fixed_count} out of {total_fixes} broken links!")
    return fixed_count

def main():
    """Main function."""
    if len(sys.argv) > 1:
        repo_root = sys.argv[1]
    else:
        repo_root = "."
    
    fixed_count = fix_broken_links(repo_root)
    
    if fixed_count > 0:
        print("\n📋 Next steps:")
        print("1. Run the anchor link checker to verify fixes")
        print("2. Commit the changes")
        print("3. Test the links in GitHub")
        
    return 0 if fixed_count > 0 else 1

if __name__ == "__main__":
    sys.exit(main())
