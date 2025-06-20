#!/usr/bin/env python3
"""
Check anchor links in README files, excluding dependency directories
"""

import os
import re
import sys
from collections import defaultdict
from pathlib import Path

def find_readme_files(root_dir, exclude_dirs=None):
    """Find all README.md files, excluding specified directories"""
    exclude_dirs = exclude_dirs or ['node_modules', '.git', '.next']
    readme_files = []
    
    for root, dirs, files in os.walk(root_dir):
        # Remove excluded directories from the search
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.lower() == 'readme.md':
                readme_files.append(os.path.join(root, file))
    
    return sorted(readme_files)

def extract_headers_and_anchors(file_path):
    """Extract headers and anchor links from a markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        return [], [], str(e)
    
    # Find headers (# ## ### etc.)
    header_pattern = r'^(#{1,6})\s+(.+)$'
    headers = []
    
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        match = re.match(header_pattern, line, re.MULTILINE)
        if match:
            level = len(match.group(1))
            title = match.group(2).strip()
            # Generate anchor ID (simplified GitHub rules)
            anchor_id = re.sub(r'[^\w\-_]', '', title.lower().replace(' ', '-'))
            headers.append({
                'line': i,
                'level': level,
                'title': title,
                'anchor': anchor_id
            })
    
    # Find HTML anchor tags
    html_anchor_pattern = r'<a id="([^"]+)"'
    for i, line in enumerate(lines, 1):
        matches = re.finditer(html_anchor_pattern, line)
        for match in matches:
            anchor_id = match.group(1)
            headers.append({
                'line': i,
                'level': 0,  # HTML anchors don't have levels
                'title': f'HTML Anchor: {anchor_id}',
                'anchor': anchor_id
            })
    
    # Find anchor links [text](#anchor)
    anchor_link_pattern = r'\[([^\]]*)\]\(#([^)]+)\)'
    anchor_links = []
    
    for i, line in enumerate(lines, 1):
        matches = re.finditer(anchor_link_pattern, line)
        for match in matches:
            text = match.group(1)
            anchor = match.group(2)
            anchor_links.append({
                'line': i,
                'text': text,
                'anchor': anchor,
                'full_match': match.group(0)
            })
    
    return headers, anchor_links, None

def suggest_anchor_fix(header_title):
    """Suggest an anchor fix for a header with special characters"""
    # GitHub anchor generation rules (simplified)
    anchor = header_title.lower()
    # Replace spaces with hyphens
    anchor = re.sub(r'\s+', '-', anchor)
    # Remove most special characters but keep some
    anchor = re.sub(r'[^\w\-_.]', '', anchor)
    # Remove multiple consecutive hyphens
    anchor = re.sub(r'-+', '-', anchor)
    # Remove leading/trailing hyphens
    anchor = anchor.strip('-')
    
    return anchor

def check_anchor_links():
    """Main function to check anchor links"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    readme_files = find_readme_files(script_dir)
    
    print(f"Checking {len(readme_files)} README files (excluding dependencies)...")
    
    total_files = len(readme_files)
    issues = []
    broken_links = 0
    suggestions = 0
    auto_fixable = 0
    
    for file_path in readme_files:
        rel_path = os.path.relpath(file_path, script_dir)
        print(f"Checking: {rel_path}")
        
        headers, anchor_links, error = extract_headers_and_anchors(file_path)
        
        if error:
            issues.append(f"❌ Error reading {rel_path}: {error}")
            continue
        
        # Create a set of valid anchors from headers
        valid_anchors = {h['anchor'] for h in headers}
        
        file_issues = []
        
        # Check for broken anchor links
        for link in anchor_links:
            if link['anchor'] not in valid_anchors:
                broken_links += 1
                issue = f"  🔗 Line {link['line']}: Broken anchor link: #{link['anchor']}"
                
                # Try to find a close match
                best_match = None
                min_distance = float('inf')
                
                for valid_anchor in valid_anchors:
                    # Simple similarity check
                    distance = abs(len(link['anchor']) - len(valid_anchor))
                    if distance < min_distance and (
                        link['anchor'].lower() in valid_anchor.lower() or
                        valid_anchor.lower() in link['anchor'].lower()
                    ):
                        min_distance = distance
                        best_match = valid_anchor
                
                if best_match:
                    issue += f"\n     Suggested fix: {best_match}"
                    auto_fixable += 1
                
                file_issues.append(issue)
        
        # Check for headers with special characters that might benefit from explicit anchors
        for header in headers:
            if re.search(r'[^\w\s\-_.]', header['title']):
                suggestions += 1
                suggested_anchor = suggest_anchor_fix(header['title'])
                suggestion = f"  💡 Line {header['line']}: Header with special characters could benefit from explicit anchor"
                suggestion += f"\n     Suggested fix: <a id=\"{suggested_anchor}\"></a>"
                file_issues.append(suggestion)
        
        if file_issues:
            issues.append(f"\n📁 {rel_path}")
            issues.extend(file_issues)
    
    # Print summary
    print("\n" + "="*60)
    print("ANCHOR LINK CHECK REPORT")
    print("="*60)
    print(f"Files checked: {total_files}")
    print(f"Total issues: {broken_links + suggestions}")
    print(f"Broken links: {broken_links}")
    print(f"Suggestions: {suggestions}")
    print(f"Auto-fixable: {auto_fixable}")
    
    if issues:
        print(f"\nISSUES BY FILE:")
        print("-" * 40)
        for issue in issues[:50]:  # Limit output
            print(issue)
        
        if len(issues) > 50:
            print(f"\n... and {len(issues) - 50} more issues")
    
    return broken_links

if __name__ == "__main__":
    broken_count = check_anchor_links()
    sys.exit(0 if broken_count == 0 else 1)
