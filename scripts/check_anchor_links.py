#!/usr/bin/env python3
"""
Anchor Link Checker for PM Tools Templates Repository

This script systematically checks all README.md files for broken internal anchor links
and provides recommendations for fixing them.

Usage:
    python3 scripts/check_anchor_links.py [--fix] [--verbose]

Options:
    --fix      Automatically fix common anchor link issues
    --verbose  Show detailed output including all links checked
"""

import os
import re
import argparse
from pathlib import Path
from typing import List, Dict, Tuple, Set
from urllib.parse import unquote

def find_readme_files(root_dir: str) -> List[Path]:
    """Find all README.md files in the repository."""
    readme_files = []
    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules and other irrelevant directories
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
        
        for file in files:
            if file.lower() == 'readme.md':
                readme_files.append(Path(root) / file)
    
    return sorted(readme_files)

def extract_anchor_links(content: str) -> List[Tuple[str, str, int]]:
    """Extract all internal anchor links from markdown content.
    
    Returns list of tuples: (link_text, anchor, line_number)
    """
    links = []
    lines = content.split('\n')
    
    # Pattern for markdown links with anchors: [text](#anchor)
    anchor_pattern = re.compile(r'\[([^\]]+)\]\(#([^)]+)\)')
    
    for line_num, line in enumerate(lines, 1):
        matches = anchor_pattern.findall(line)
        for text, anchor in matches:
            links.append((text, anchor, line_num))
    
    return links

def extract_headers(content: str) -> List[Tuple[str, str, int]]:
    """Extract all headers from markdown content.
    
    Returns list of tuples: (header_text, predicted_anchor, line_number)
    """
    headers = []
    lines = content.split('\n')
    
    # Pattern for markdown headers: ## Header Text
    header_pattern = re.compile(r'^(#{1,6})\s+(.+)$')
    
    for line_num, line in enumerate(lines, 1):
        match = header_pattern.match(line.strip())
        if match:
            level = len(match.group(1))
            header_text = match.group(2).strip()
            
            # Generate predicted anchor based on GitHub's rules
            predicted_anchor = generate_github_anchor(header_text)
            headers.append((header_text, predicted_anchor, line_num))
    
    return headers

def extract_html_anchors(content: str) -> List[Tuple[str, int]]:
    """Extract explicit HTML anchor tags from markdown content.
    
    Returns list of tuples: (anchor_id, line_number)
    """
    anchors = []
    lines = content.split('\n')
    
    # Pattern for HTML anchor tags: <a id="anchor"></a> or <a name="anchor"></a>
    anchor_pattern = re.compile(r'<a\s+(?:id|name)=["\']([^"\']+)["\'][^>]*>')
    
    for line_num, line in enumerate(lines, 1):
        matches = anchor_pattern.findall(line)
        for anchor_id in matches:
            anchors.append((anchor_id, line_num))
    
    return anchors

def generate_github_anchor(header_text: str) -> str:
    """Generate GitHub-style anchor from header text.
    
    GitHub's rules:
    1. Convert to lowercase
    2. Replace spaces with hyphens
    3. Remove most special characters
    4. Remove emojis (mostly)
    5. Remove leading/trailing hyphens
    """
    # Remove emojis and other unicode characters
    anchor = re.sub(r'[^\w\s\-_]', '', header_text)
    
    # Convert to lowercase and replace spaces with hyphens
    anchor = anchor.lower().strip()
    anchor = re.sub(r'\s+', '-', anchor)
    
    # Remove multiple consecutive hyphens
    anchor = re.sub(r'-+', '-', anchor)
    
    # Remove leading/trailing hyphens
    anchor = anchor.strip('-')
    
    return anchor

def check_anchor_links(file_path: Path, verbose: bool = False) -> Dict:
    """Check all anchor links in a single README file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {
            'file': str(file_path),
            'error': f"Could not read file: {e}",
            'anchor_links': [],
            'headers': [],
            'html_anchors': [],
            'issues': [],
            'suggestions': []
        }
    
    # Extract all components
    anchor_links = extract_anchor_links(content)
    headers = extract_headers(content)
    html_anchors = extract_html_anchors(content)
    
    # Build available anchors set
    available_anchors = set()
    
    # Add GitHub-generated anchors from headers
    for header_text, predicted_anchor, _ in headers:
        available_anchors.add(predicted_anchor)
    
    # Add explicit HTML anchors
    for anchor_id, _ in html_anchors:
        available_anchors.add(anchor_id)
    
    # Check for issues
    issues = []
    suggestions = []
    
    for link_text, anchor, line_num in anchor_links:
        if anchor not in available_anchors:
            issues.append({
                'type': 'broken_anchor',
                'line': line_num,
                'link_text': link_text,
                'anchor': anchor,
                'message': f"Anchor '{anchor}' not found"
            })
            
            # Try to find similar anchors
            similar_anchors = find_similar_anchors(anchor, available_anchors)
            if similar_anchors:
                suggestions.append({
                    'line': line_num,
                    'current_anchor': anchor,
                    'suggested_anchors': similar_anchors,
                    'message': f"Did you mean: {', '.join(similar_anchors)}"
                })
    
    # Check for headers with emojis that might cause anchor issues
    for header_text, predicted_anchor, line_num in headers:
        if re.search(r'[^\w\s\-_]', header_text) and not any(anchor_id == predicted_anchor for anchor_id, _ in html_anchors):
            suggestions.append({
                'line': line_num,
                'header_text': header_text,
                'predicted_anchor': predicted_anchor,
                'message': f"Header contains special characters. Consider adding explicit anchor: <a id=\"{predicted_anchor}\"></a>",
                'type': 'emoji_header'
            })
    
    result = {
        'file': str(file_path),
        'anchor_links': anchor_links,
        'headers': headers,
        'html_anchors': html_anchors,
        'available_anchors': sorted(available_anchors),
        'issues': issues,
        'suggestions': suggestions
    }
    
    if verbose:
        print(f"\n📄 {file_path}")
        print(f"   Links: {len(anchor_links)}, Headers: {len(headers)}, HTML Anchors: {len(html_anchors)}")
        if issues:
            print(f"   ❌ Issues: {len(issues)}")
        if suggestions:
            print(f"   💡 Suggestions: {len(suggestions)}")
    
    return result

def find_similar_anchors(target: str, available: Set[str]) -> List[str]:
    """Find similar anchor names using simple string matching."""
    similar = []
    target_lower = target.lower()
    
    for anchor in available:
        anchor_lower = anchor.lower()
        
        # Exact match (shouldn't happen, but just in case)
        if target_lower == anchor_lower:
            continue
            
        # Check if one contains the other
        if target_lower in anchor_lower or anchor_lower in target_lower:
            similar.append(anchor)
            continue
        
        # Check for similar words
        target_words = set(target_lower.split('-'))
        anchor_words = set(anchor_lower.split('-'))
        
        # If they share more than half their words, consider them similar
        common_words = target_words.intersection(anchor_words)
        if len(common_words) > 0 and len(common_words) >= min(len(target_words), len(anchor_words)) / 2:
            similar.append(anchor)
    
    return similar[:3]  # Return top 3 suggestions

def generate_fix_suggestions(issues: List[Dict], suggestions: List[Dict]) -> List[str]:
    """Generate actionable fix suggestions."""
    fixes = []
    
    for issue in issues:
        if issue['type'] == 'broken_anchor':
            fixes.append(f"Line {issue['line']}: Fix broken anchor '#{issue['anchor']}' in link '{issue['link_text']}'")
    
    for suggestion in suggestions:
        if suggestion.get('type') == 'emoji_header':
            fixes.append(f"Line {suggestion['line']}: Add explicit anchor for header with special characters")
        else:
            fixes.append(f"Line {suggestion['line']}: Consider updating anchor '{suggestion['current_anchor']}'")
    
    return fixes

def auto_fix_common_issues(file_path: Path, issues: List[Dict], suggestions: List[Dict]) -> bool:
    """Automatically fix common anchor link issues."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.split('\n')
        modified = False
        
        # Fix emoji headers by adding explicit anchors
        for suggestion in suggestions:
            if suggestion.get('type') == 'emoji_header':
                line_num = suggestion['line'] - 1  # Convert to 0-based index
                predicted_anchor = suggestion['predicted_anchor']
                
                # Add explicit anchor before the header
                anchor_tag = f'<a id="{predicted_anchor}"></a>'
                lines.insert(line_num, anchor_tag)
                modified = True
        
        if modified:
            new_content = '\n'.join(lines)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
    
    except Exception as e:
        print(f"❌ Error fixing {file_path}: {e}")
    
    return False

def main():
    parser = argparse.ArgumentParser(description='Check anchor links in README files')
    parser.add_argument('--fix', action='store_true', help='Automatically fix common issues')
    parser.add_argument('--verbose', action='store_true', help='Show detailed output')
    parser.add_argument('--root', default='.', help='Root directory to search (default: current directory)')
    args = parser.parse_args()
    
    root_dir = Path(args.root).resolve()
    print(f"🔍 Checking anchor links in README files under: {root_dir}")
    
    readme_files = find_readme_files(str(root_dir))
    print(f"📁 Found {len(readme_files)} README.md files")
    
    all_issues = []
    all_suggestions = []
    files_with_issues = 0
    files_fixed = 0
    
    for file_path in readme_files:
        result = check_anchor_links(file_path, args.verbose)
        
        if 'error' in result:
            print(f"❌ Error processing {file_path}: {result['error']}")
            continue
        
        issues = result['issues']
        suggestions = result['suggestions']
        
        if issues or suggestions:
            files_with_issues += 1
            all_issues.extend(issues)
            all_suggestions.extend(suggestions)
            
            print(f"\n📄 {file_path.relative_to(root_dir)}")
            
            # Show issues
            for issue in issues:
                print(f"   ❌ Line {issue['line']}: {issue['message']}")
                print(f"      Link: [{issue['link_text']}](#{issue['anchor']})")
            
            # Show suggestions
            for suggestion in suggestions:
                print(f"   💡 Line {suggestion['line']}: {suggestion['message']}")
            
            # Auto-fix if requested
            if args.fix:
                if auto_fix_common_issues(file_path, issues, suggestions):
                    print(f"   ✅ Auto-fixed common issues")
                    files_fixed += 1
    
    # Summary
    print(f"\n" + "="*50)
    print(f"📊 SUMMARY")
    print(f"   Files checked: {len(readme_files)}")
    print(f"   Files with issues: {files_with_issues}")
    print(f"   Total issues: {len(all_issues)}")
    print(f"   Total suggestions: {len(all_suggestions)}")
    
    if args.fix:
        print(f"   Files auto-fixed: {files_fixed}")
    
    if files_with_issues == 0:
        print("✅ No anchor link issues found!")
    else:
        print(f"\n💡 To fix remaining issues:")
        print(f"   1. Review the output above")
        print(f"   2. Add explicit <a id=\"...\"></a> tags before headers with special characters")
        print(f"   3. Update broken anchor links to match available anchors")
        print(f"   4. Re-run with --fix to auto-fix common issues")

if __name__ == "__main__":
    main()

