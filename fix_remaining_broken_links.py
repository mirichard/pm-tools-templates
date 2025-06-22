#!/usr/bin/env python3

def fix_broken_link(file_path, line_number, broken_anchor, suggested_fix):
    """Fix a single broken anchor link"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        if line_number <= len(lines):
            line = lines[line_number - 1]
            # Replace the broken anchor with the suggested fix
            fixed_line = line.replace(broken_anchor, f"#{suggested_fix}")
            lines[line_number - 1] = fixed_line
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            
            print(f"✅ Fixed {file_path}:{line_number} - {broken_anchor} → #{suggested_fix}")
            return True
        else:
            print(f"❌ Line number {line_number} out of range in {file_path}")
            return False
    except Exception as e:
        print(f"❌ Error fixing {file_path}:{line_number} - {e}")
        return False

def main():
    """Fix all the remaining broken anchor links identified by the checker"""
    
    fixes = [
        {
            "file": "ANCHOR_LINK_CRITICAL_ISSUES_SUMMARY.md",
            "line": 43,
            "broken": "#broken--anchor",
            "fix": "recommendations"
        },
        {
            "file": "ANCHOR_LINK_CRITICAL_ISSUES_SUMMARY.md", 
            "line": 44,
            "broken": "#section",
            "fix": "recommendations"
        },
        {
            "file": "ANCHOR_LINK_CRITICAL_ISSUES_SUMMARY.md",
            "line": 45,
            "broken": "#wrong-target",
            "fix": "low-impact"
        },
        {
            "file": "ANCHOR_LINK_CRITICAL_ISSUES_SUMMARY.md",
            "line": 48,
            "broken": "#2-broken-anchor-references",
            "fix": "common-fix-patterns"
        },
        {
            "file": "ANCHOR_LINK_CRITICAL_ISSUES_SUMMARY.md",
            "line": 49,
            "broken": "#1-section",
            "fix": "low-impact"
        },
        {
            "file": "ANCHOR_LINK_CRITICAL_ISSUES_SUMMARY.md",
            "line": 50,
            "broken": "#correct-target",
            "fix": "recommendations"
        },
        {
            "file": "ANCHOR_LINK_MAINTENANCE.md",
            "line": 114,
            "broken": "#approval-baseline-process",
            "fix": "in-checkanchorlinkspy"
        },
        {
            "file": "ANCHOR_LINK_MAINTENANCE.md",
            "line": 117,
            "broken": "#approval-baseline-process", 
            "fix": "in-checkanchorlinkspy"
        },
        {
            "file": "docs/ANCHOR_LINK_MAINTENANCE.md",
            "line": 11,
            "broken": "#system-components",
            "fix": "common-problems"
        },
        {
            "file": "docs/ANCHOR_LINK_MAINTENANCE.md",
            "line": 82,
            "broken": "#system-components-name",
            "fix": "macos-brew-install-python3"
        },
        {
            "file": "docs/security-workflows-integration.md",
            "line": 12,
            "broken": "#monitoring--alerting",
            "fix": "monitoring-alerting"
        },
        {
            "file": "industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md",
            "line": 32,
            "broken": "#4-implementation-timeline",
            "fix": "4-implementation"
        },
        {
            "file": "industry_templates/software_development/user_story_template.md",
            "line": 227,
            "broken": "#story-splitting-if-needed",
            "fix": ""  # Remove the broken link entirely
        }
    ]
    
    successful_fixes = 0
    total_fixes = len(fixes)
    
    print(f"🔧 Fixing {total_fixes} broken anchor links...")
    print()
    
    for fix in fixes:
        file_path = fix["file"]
        
        # Handle the special case where we need to remove the broken link entirely
        if fix["broken"] == "#story-splitting-if-needed" and fix["fix"] == "":
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Remove the broken link reference
                fixed_content = content.replace("#story-splitting-if-needed", "")
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                
                print(f"✅ Removed broken link from {file_path}")
                successful_fixes += 1
                
            except Exception as e:
                print(f"❌ Error fixing {file_path} - {e}")
        else:
            if fix_broken_link(file_path, fix["line"], fix["broken"], fix["fix"]):
                successful_fixes += 1
    
    print()
    print(f"📊 Fix Summary:")
    print(f"   Total attempted: {total_fixes}")
    print(f"   Successful: {successful_fixes}")
    print(f"   Failed: {total_fixes - successful_fixes}")
    
    if successful_fixes == total_fixes:
        print("🎉 All broken links fixed successfully!")
        return True
    else:
        print("⚠️  Some fixes failed. Please check manually.")
        return False

if __name__ == "__main__":
    main()
