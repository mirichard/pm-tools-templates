#!/usr/bin/env python3

import os
import re
import glob
from pathlib import Path
from urllib.parse import urlparse, unquote
import sys

class LinkHealthChecker:
    def __init__(self, root_dir="."):
        self.root_dir = Path(root_dir).resolve()
        self.broken_links = []
        self.suggestions = []
        self.auto_fixable = []
        self.file_count = 0
        
    def should_skip_directory(self, dir_path):
        """Skip node_modules and other irrelevant directories"""
        skip_dirs = {
            'node_modules', '.git', '.vscode', '.idea', 
            'dist', 'build', '.next', 'coverage', 
            '__pycache__', '.pytest_cache'
        }
        return any(skip_dir in str(dir_path) for skip_dir in skip_dirs)
    
    def find_markdown_files(self):
        """Find all markdown files excluding node_modules and build directories"""
        md_files = []
        for md_file in self.root_dir.rglob("*.md"):
            if not self.should_skip_directory(md_file):
                md_files.append(md_file)
        return sorted(md_files)
    
    def extract_headers(self, content):
        """Extract headers and their potential anchor IDs"""
        headers = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Match markdown headers
            header_match = re.match(r'^(#{1,6})\s+(.+)$', line.strip())
            if header_match:
                level = len(header_match.group(1))
                text = header_match.group(2).strip()
                
                # Generate anchor ID (GitHub style)
                anchor_id = self.generate_anchor_id(text)
                
                headers.append({
                    'line': i,
                    'level': level,
                    'text': text,
                    'anchor_id': anchor_id,
                    'raw_line': line
                })
        
        return headers
    
    def generate_anchor_id(self, text):
        """Generate GitHub-style anchor ID from header text"""
        # Remove markdown formatting
        text = re.sub(r'[*_`]', '', text)
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        # Convert to lowercase
        text = text.lower()
        # Replace spaces and special chars with hyphens
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[\s_-]+', '-', text)
        # Remove leading/trailing hyphens
        text = text.strip('-')
        return text
    
    def find_anchor_links(self, content):
        """Find all anchor links in the content"""
        anchor_links = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Find markdown links with anchors
            links = re.finditer(r'\[([^\]]+)\]\(([^)]+)\)', line)
            for match in links:
                link_text = match.group(1)
                link_url = match.group(2)
                
                # Check if it's an anchor link
                if link_url.startswith('#'):
                    anchor_id = link_url[1:]  # Remove the #
                    anchor_links.append({
                        'line': i,
                        'text': link_text,
                        'anchor': anchor_id,
                        'full_match': match.group(0)
                    })
        
        return anchor_links
    
    def check_file(self, file_path):
        """Check a single markdown file for link issues"""
        rel_path = file_path.relative_to(self.root_dir)
        print(f"Checking: {rel_path}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {rel_path}: {e}")
            return
        
        headers = self.extract_headers(content)
        anchor_links = self.find_anchor_links(content)
        
        # Create a set of valid anchor IDs
        valid_anchors = {header['anchor_id'] for header in headers}
        
        # Check each anchor link
        for link in anchor_links:
            if link['anchor'] not in valid_anchors:
                # Try to find a close match
                suggestion = self.find_closest_anchor(link['anchor'], valid_anchors)
                
                self.broken_links.append({
                    'file': str(rel_path),
                    'line': link['line'],
                    'anchor': link['anchor'],
                    'suggestion': suggestion,
                    'link_text': link['text']
                })
        
        # Check for headers that could benefit from explicit anchors
        for header in headers:
            if self.needs_explicit_anchor(header['text']):
                self.suggestions.append({
                    'file': str(rel_path),
                    'line': header['line'],
                    'header': header['text'],
                    'suggested_anchor': f'<a id="{header["anchor_id"]}"></a>'
                })
    
    def needs_explicit_anchor(self, header_text):
        """Check if header has special characters that might benefit from explicit anchor"""
        # Headers with special characters, code, or complex formatting
        special_chars = re.search(r'[^\w\s-]|[(){}[\]<>]|`.*`', header_text)
        return bool(special_chars)
    
    def find_closest_anchor(self, target, valid_anchors):
        """Find the closest matching anchor using simple string similarity"""
        if not valid_anchors:
            return None
        
        target_lower = target.lower()
        best_match = None
        best_score = 0
        
        for anchor in valid_anchors:
            # Simple similarity: count common characters
            common = len(set(target_lower) & set(anchor.lower()))
            score = common / max(len(target_lower), len(anchor.lower()))
            
            if score > best_score and score > 0.3:  # Minimum similarity threshold
                best_score = score
                best_match = anchor
        
        return best_match
    
    def run_check(self):
        """Run the complete link health check"""
        md_files = self.find_markdown_files()
        self.file_count = len(md_files)
        
        print(f"Checking {self.file_count} markdown files (excluding node_modules)...")
        
        for md_file in md_files:
            self.check_file(md_file)
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate a comprehensive report"""
        total_issues = len(self.broken_links) + len(self.suggestions)
        
        report = f"""
============================================================
FILTERED ANCHOR LINK CHECK REPORT (Main Project Files Only)
============================================================
Files checked: {self.file_count}
Total issues: {total_issues}
Broken links: {len(self.broken_links)}
Suggestions: {len(self.suggestions)}

ISSUES BY CATEGORY:
----------------------------------------
"""
        
        if self.broken_links:
            report += "\n🔗 BROKEN ANCHOR LINKS:\n"
            for issue in self.broken_links:
                report += f"\n📁 {issue['file']}\n"
                report += f"  🔗 Line {issue['line']}: Broken anchor link: #{issue['anchor']}\n"
                if issue['suggestion']:
                    report += f"     Suggested fix: {issue['suggestion']}\n"
        
        if self.suggestions:
            report += "\n💡 HEADERS NEEDING EXPLICIT ANCHORS:\n"
            grouped_suggestions = {}
            for suggestion in self.suggestions:
                file_path = suggestion['file']
                if file_path not in grouped_suggestions:
                    grouped_suggestions[file_path] = []
                grouped_suggestions[file_path].append(suggestion)
            
            for file_path, suggestions in grouped_suggestions.items():
                report += f"\n📁 {file_path}\n"
                for suggestion in suggestions[:5]:  # Limit to first 5 per file
                    report += f"  💡 Line {suggestion['line']}: Header with special characters could benefit from explicit anchor\n"
                    report += f"     Suggested fix: {suggestion['suggested_anchor']}\n"
                if len(suggestions) > 5:
                    report += f"  ... and {len(suggestions) - 5} more suggestions\n"
        
        return report

if __name__ == "__main__":
    checker = LinkHealthChecker()
    report = checker.run_check()
    print(report)
    
    # Save detailed report to file
    with open("link_health_report_filtered.txt", "w") as f:
        f.write(report)
    
    print(f"\n📄 Detailed report saved to: link_health_report_filtered.txt")
