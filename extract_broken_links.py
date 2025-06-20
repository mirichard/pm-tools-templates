#!/usr/bin/env python3
"""
Extract broken links from link checker for focused analysis
"""

import os
import re
import sys
from pathlib import Path

def find_readme_files(root_dir, exclude_dirs=None):
    """Find all README.md files, excluding specified directories"""
    exclude_dirs = exclude_dirs or ['node_modules', '.git', '.next']
    readme_files = []
    
    for root, dirs, files in os.walk(root_dir):
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
    
    # Find headers
    header_pattern = r'^(#{1,6})\s+(.+)$'
    headers = []
    
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        match = re.match(header_pattern, line, re.MULTILINE)
        if match:
            level = len(match.group(1))
            title = match.group(2).strip()
            anchor_id = re.sub(r'[^\w\-_]', '', title.lower().replace(' ', '-'))
            headers.append({
                'line': i,
                'level': level,
                'title': title,
                'anchor': anchor_id
            })
    
    # Find anchor links
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

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    readme_files = find_readme_files(script_dir)
    
    broken_links = []
    
    for file_path in readme_files:
        rel_path = os.path.relpath(file_path, script_dir)
        headers, anchor_links, error = extract_headers_and_anchors(file_path)
        
        if error:
            continue
        
        valid_anchors = {h['anchor'] for h in headers}
        
        for link in anchor_links:
            if link['anchor'] not in valid_anchors:
                # Try to find a close match
                best_match = None
                for valid_anchor in valid_anchors:
                    if (link['anchor'].lower() in valid_anchor.lower() or
                        valid_anchor.lower() in link['anchor'].lower()):
                        best_match = valid_anchor
                        break
                
                broken_links.append({
                    'file': rel_path,
                    'line': link['line'],
                    'broken_anchor': link['anchor'],
                    'suggested_fix': best_match,
                    'text': link['text']
                })
    
    print("BROKEN LINKS ANALYSIS")
    print("="*50)
    print(f"Total broken links: {len(broken_links)}")
    print()
    
    # Group by file
    files_with_issues = {}
    for link in broken_links:
        if link['file'] not in files_with_issues:
            files_with_issues[link['file']] = []
        files_with_issues[link['file']].append(link)
    
    print("BROKEN LINKS BY FILE:")
    print("-"*30)
    
    for file_path, links in files_with_issues.items():
        print(f"\n📁 {file_path} ({len(links)} issues)")
        for link in links:
            print(f"  Line {link['line']}: #{link['broken_anchor']}")
            if link['suggested_fix']:
                print(f"    → Suggested: {link['suggested_fix']}")
            else:
                print(f"    → No suggestion available")
    
    return len(broken_links)

if __name__ == "__main__":
    count = main()
    sys.exit(0)
