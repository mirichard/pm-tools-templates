#!/usr/bin/env python3
"""
Comprehensive link statistics analysis for README files
"""

import os
import re

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

def analyze_links_in_file(file_path):
    """Analyze all types of links in a markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        return {}, str(e)
    
    lines = content.split('\n')
    
    # Find all anchor links [text](#anchor)
    anchor_link_pattern = r'\[([^\]]*)\]\(#([^)]+)\)'
    anchor_links = []
    
    # Find all external links [text](http...)
    external_link_pattern = r'\[([^\]]*)\]\((https?://[^)]+)\)'
    external_links = []
    
    # Find all relative links [text](path)
    relative_link_pattern = r'\[([^\]]*)\]\(([^)#]+)\)'
    relative_links = []
    
    # Find HTML anchor tags
    html_anchor_pattern = r'<a id="([^"]+)"'
    html_anchors = set()
    
    # Find markdown headers
    header_pattern = r'^(#{1,6})\s+(.+)$'
    headers = []
    
    for i, line in enumerate(lines, 1):
        # Anchor links
        for match in re.finditer(anchor_link_pattern, line):
            anchor_links.append({
                'line': i,
                'text': match.group(1),
                'anchor': match.group(2),
                'full_match': match.group(0)
            })
        
        # External links  
        for match in re.finditer(external_link_pattern, line):
            external_links.append({
                'line': i,
                'text': match.group(1),
                'url': match.group(2),
                'full_match': match.group(0)
            })
        
        # Relative links (excluding anchor and external links)
        for match in re.finditer(relative_link_pattern, line):
            url = match.group(2)
            if not url.startswith('http') and not url.startswith('#'):
                relative_links.append({
                    'line': i,
                    'text': match.group(1),
                    'path': url,
                    'full_match': match.group(0)
                })
        
        # HTML anchors
        for match in re.finditer(html_anchor_pattern, line):
            html_anchors.add(match.group(1))
        
        # Headers
        header_match = re.match(header_pattern, line, re.MULTILINE)
        if header_match:
            level = len(header_match.group(1))
            title = header_match.group(2).strip()
            anchor_id = re.sub(r'[^\w\-_]', '', title.lower().replace(' ', '-'))
            headers.append({
                'line': i,
                'level': level,
                'title': title,
                'anchor': anchor_id
            })
    
    # Combine valid anchors from headers and HTML anchors
    valid_anchors = html_anchors.union({h['anchor'] for h in headers})
    
    # Check broken anchor links
    broken_anchor_links = []
    for link in anchor_links:
        if link['anchor'] not in valid_anchors:
            broken_anchor_links.append(link)
    
    return {
        'anchor_links': anchor_links,
        'external_links': external_links,
        'relative_links': relative_links,
        'html_anchors': list(html_anchors),
        'headers': headers,
        'valid_anchors': list(valid_anchors),
        'broken_anchor_links': broken_anchor_links,
        'total_links': len(anchor_links) + len(external_links) + len(relative_links)
    }, None

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    readme_files = find_readme_files(script_dir)
    
    total_files = len(readme_files)
    total_anchor_links = 0
    total_external_links = 0
    total_relative_links = 0
    total_broken_anchor_links = 0
    total_all_links = 0
    
    files_with_issues = 0
    
    print("=" * 60)
    print("COMPREHENSIVE LINK ANALYSIS REPORT")
    print("=" * 60)
    print(f"Analyzing {total_files} README files...")
    print()
    
    for file_path in readme_files:
        rel_path = os.path.relpath(file_path, script_dir)
        analysis, error = analyze_links_in_file(file_path)
        
        if error:
            print(f"❌ Error analyzing {rel_path}: {error}")
            continue
        
        file_anchor_links = len(analysis['anchor_links'])
        file_external_links = len(analysis['external_links'])
        file_relative_links = len(analysis['relative_links'])
        file_broken_links = len(analysis['broken_anchor_links'])
        file_total_links = analysis['total_links']
        
        total_anchor_links += file_anchor_links
        total_external_links += file_external_links
        total_relative_links += file_relative_links
        total_broken_anchor_links += file_broken_links
        total_all_links += file_total_links
        
        if file_broken_links > 0:
            files_with_issues += 1
    
    print("SUMMARY STATISTICS:")
    print("-" * 40)
    print(f"📁 Total README files analyzed: {total_files}")
    print(f"🔗 Total links found: {total_all_links}")
    print(f"   • Anchor links (internal): {total_anchor_links}")
    print(f"   • External links (http/https): {total_external_links}")
    print(f"   • Relative links (files): {total_relative_links}")
    print()
    print(f"❌ Broken anchor links: {total_broken_anchor_links}")
    print(f"📁 Files with broken links: {files_with_issues}")
    print()
    
    # Calculate percentages
    if total_anchor_links > 0:
        broken_percentage = (total_broken_anchor_links / total_anchor_links) * 100
        print(f"🔢 BROKEN ANCHOR LINK PERCENTAGE: {broken_percentage:.2f}%")
    else:
        print(f"🔢 BROKEN ANCHOR LINK PERCENTAGE: 0.00%")
    
    if total_all_links > 0:
        overall_broken_percentage = (total_broken_anchor_links / total_all_links) * 100
        print(f"🔢 OVERALL BROKEN LINK PERCENTAGE: {overall_broken_percentage:.2f}%")
    else:
        print(f"🔢 OVERALL BROKEN LINK PERCENTAGE: 0.00%")
    
    print()
    print("LINK HEALTH STATUS:")
    print("-" * 40)
    if total_broken_anchor_links == 0:
        print("✅ EXCELLENT: All anchor links are working properly!")
    elif broken_percentage < 1:
        print("🟡 GOOD: Very few broken links detected")
    elif broken_percentage < 5:
        print("🟠 FAIR: Some broken links need attention")
    else:
        print("🔴 POOR: Significant broken link issues detected")
    
    return total_broken_anchor_links

if __name__ == "__main__":
    main()
