#!/usr/bin/env python3
"""
Anchor Link Checker for PM Tools Templates Repository

This script systematically analyzes all README.md files for internal anchor link problems,
including broken anchors and headers with special characters or emojis causing GitHub
anchor generation issues. It predicts GitHub's anchor generation rules, extracts explicit
HTML anchors, and provides intelligent suggestions and auto-fixes for common cases.

Usage:
    python check_anchor_links.py [--auto-fix] [--output report.json]

Examples:
    python check_anchor_links.py                    # Check only
    python check_anchor_links.py --auto-fix         # Check and auto-fix
    python check_anchor_links.py --output report.json  # Save report
"""

import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass, asdict
import unicodedata

@dataclass
class AnchorIssue:
    """Represents an anchor link issue found in a file."""
    file_path: str
    line_number: int
    issue_type: str  # 'broken_link', 'missing_anchor', 'suggestion'
    description: str
    anchor_link: str
    target_header: Optional[str] = None
    suggested_fix: Optional[str] = None
    auto_fixable: bool = False

class GitHubAnchorGenerator:
    """Simulates GitHub's anchor generation algorithm."""
    
    @staticmethod
    def generate_anchor(header_text: str) -> str:
        """Generate anchor ID following GitHub's rules."""
        # Remove markdown syntax
        text = re.sub(r'[*_`]', '', header_text)
        
        # Remove emojis and special Unicode characters
        text = ''.join(char for char in text if unicodedata.category(char) not in ('So', 'Sm', 'Sk'))
        
        # Convert to lowercase
        text = text.lower()
        
        # Replace spaces and special characters with hyphens
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[\s_-]+', '-', text)
        
        # Remove leading/trailing hyphens
        text = text.strip('-')
        
        return text

class AnchorLinkChecker:
    """Main class for checking anchor links in README files."""
    
    def __init__(self, root_dir: str = "."):
        self.root_dir = Path(root_dir)
        self.issues: List[AnchorIssue] = []
        self.anchor_generator = GitHubAnchorGenerator()
        
    def find_readme_files(self) -> List[Path]:
        """Find all README.md files in the repository, skipping dependencies/build dirs."""
        readme_files = []
        skip_dirs = {"node_modules", ".git", ".vscode", ".idea", "dist", "build", ".next", "coverage", "__pycache__", ".pytest_cache", "public"}
        for path in self.root_dir.rglob("README.md"):
            # Skip hidden directories and common ignore patterns
            if any(part.startswith('.') for part in path.parts):
                continue
            # Skip known dependency/build directories
            if any(part in skip_dirs for part in path.parts):
                continue
            readme_files.append(path)
        return readme_files
    
    def extract_headers_and_anchors(self, content: str) -> Tuple[Dict[int, str], Set[str]]:
        """Extract headers and existing HTML anchors from content."""
        headers = {}  # line_number -> header_text
        anchors = set()  # existing anchor IDs
        
        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            # Extract markdown headers
            header_match = re.match(r'^(#{1,6})\s+(.+)$', line.strip())
            if header_match:
                header_text = header_match.group(2)
                headers[i] = header_text
            
            # Extract HTML anchor IDs
            anchor_matches = re.findall(r'<a\s+id=["\']([^"\']+)["\']', line)
            anchors.update(anchor_matches)
        
        return headers, anchors
    
    def extract_anchor_links(self, content: str) -> List[Tuple[int, str]]:
        """Extract internal anchor links from content."""
        links = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Find markdown links with anchor references
            link_matches = re.findall(r'\[([^\]]+)\]\(#([^)]+)\)', line)
            for text, anchor in link_matches:
                links.append((i, anchor))
        
        return links
    
    def check_file(self, file_path: Path) -> List[AnchorIssue]:
        """Check a single README file for anchor link issues."""
        file_issues = []
        
        try:
            content = file_path.read_text(encoding='utf-8')
        except Exception as e:
            file_issues.append(AnchorIssue(
                file_path=str(file_path),
                line_number=0,
                issue_type='error',
                description=f"Failed to read file: {e}",
                anchor_link="",
            ))
            return file_issues
        
        headers, existing_anchors = self.extract_headers_and_anchors(content)
        anchor_links = self.extract_anchor_links(content)
        
        # Generate expected anchors for headers
        expected_anchors = {}
        for line_num, header_text in headers.items():
            expected_anchor = self.anchor_generator.generate_anchor(header_text)
            expected_anchors[expected_anchor] = (line_num, header_text)
        
        # Check for broken anchor links
        for link_line, anchor in anchor_links:
            if anchor not in existing_anchors and anchor not in expected_anchors:
                # Try to find a close match
                suggested_anchor = self._find_closest_anchor(anchor, existing_anchors, expected_anchors)
                
                file_issues.append(AnchorIssue(
                    file_path=str(file_path),
                    line_number=link_line,
                    issue_type='broken_link',
                    description=f"Broken anchor link: #{anchor}",
                    anchor_link=anchor,
                    suggested_fix=suggested_anchor,
                    auto_fixable=suggested_anchor is not None
                ))
        
        # Check for headers that could benefit from explicit anchors
        for line_num, header_text in headers.items():
            expected_anchor = self.anchor_generator.generate_anchor(header_text)
            
            # Check if header has special characters that might cause issues
            if self._has_problematic_characters(header_text) and expected_anchor not in existing_anchors:
                file_issues.append(AnchorIssue(
                    file_path=str(file_path),
                    line_number=line_num,
                    issue_type='suggestion',
                    description=f"Header with special characters could benefit from explicit anchor",
                    anchor_link=expected_anchor,
                    target_header=header_text,
                    suggested_fix=f'<a id="{expected_anchor}"></a>',
                    auto_fixable=True
                ))
        
        return file_issues
    
    def _has_problematic_characters(self, text: str) -> bool:
        """Check if text has characters that might cause anchor generation issues."""
        # Check for emojis, special symbols, or complex punctuation
        problematic_patterns = [
            r'[\U0001F600-\U0001F64F]',  # emoticons
            r'[\U0001F300-\U0001F5FF]',  # symbols & pictographs
            r'[\U0001F680-\U0001F6FF]',  # transport & map symbols
            r'[\U0001F1E0-\U0001F1FF]',  # flags
            r'[&@#$%^*()+=\[\]{}|\\:";\'<>?,./]',  # special characters
        ]
        
        for pattern in problematic_patterns:
            if re.search(pattern, text):
                return True
        
        return False
    
    def _find_closest_anchor(self, broken_anchor: str, existing_anchors: Set[str], 
                           expected_anchors: Dict[str, Tuple[int, str]]) -> Optional[str]:
        """Find the closest matching anchor for a broken link."""
        all_anchors = list(existing_anchors) + list(expected_anchors.keys())
        
        # Simple heuristics for common issues
        # Fix double hyphens
        if '--' in broken_anchor:
            fixed = broken_anchor.replace('--', '-')
            if fixed in all_anchors:
                return fixed
        
        # Try removing extra characters
        simplified = re.sub(r'[^a-z0-9-]', '', broken_anchor.lower())
        if simplified in all_anchors:
            return simplified
        
        # Find best partial match
        best_match = None
        best_score = 0
        
        for anchor in all_anchors:
            # Simple scoring based on common substrings
            common_parts = set(broken_anchor.split('-')) & set(anchor.split('-'))
            score = len(common_parts)
            
            if score > best_score and score > 0:
                best_score = score
                best_match = anchor
        
        return best_match if best_score >= 2 else None
    
    def auto_fix_issues(self, file_path: Path, file_issues: List[AnchorIssue]) -> bool:
        """Apply auto-fixes to a file."""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            modified = False
            
            # Sort issues by line number in reverse to avoid line number shifts
            fixable_issues = [issue for issue in file_issues if issue.auto_fixable]
            fixable_issues.sort(key=lambda x: x.line_number, reverse=True)
            
            for issue in fixable_issues:
                if issue.issue_type == 'suggestion' and issue.suggested_fix:
                    # Insert anchor tag before the header
                    line_idx = issue.line_number - 1
                    if line_idx < len(lines):
                        # Insert anchor tag on the line before the header
                        lines.insert(line_idx, issue.suggested_fix)
                        modified = True
                
                elif issue.issue_type == 'broken_link' and issue.suggested_fix:
                    # Fix broken anchor link
                    line_idx = issue.line_number - 1
                    if line_idx < len(lines):
                        old_link = f"#{issue.anchor_link}"
                        new_link = f"#{issue.suggested_fix}"
                        lines[line_idx] = lines[line_idx].replace(old_link, new_link)
                        modified = True
            
            if modified:
                file_path.write_text('\n'.join(lines), encoding='utf-8')
                return True
            
        except Exception as e:
            print(f"Error auto-fixing {file_path}: {e}")
            return False
        
        return False
    
    def check_all_files(self, auto_fix: bool = False) -> List[AnchorIssue]:
        """Check all README files for anchor link issues."""
        readme_files = self.find_readme_files()
        all_issues = []
        
        print(f"Checking {len(readme_files)} README files...")
        
        for file_path in readme_files:
            print(f"Checking: {file_path}")
            file_issues = self.check_file(file_path)
            
            if auto_fix and file_issues:
                if self.auto_fix_issues(file_path, file_issues):
                    print(f"  ✅ Auto-fixed {file_path}")
                    # Re-check after fixes
                    file_issues = self.check_file(file_path)
            
            all_issues.extend(file_issues)
        
        self.issues = all_issues
        return all_issues
    
    def generate_report(self) -> Dict:
        """Generate a comprehensive report of anchor link issues."""
        report = {
            "summary": {
                "total_files_checked": len(self.find_readme_files()),
                "total_issues": len(self.issues),
                "broken_links": len([i for i in self.issues if i.issue_type == 'broken_link']),
                "suggestions": len([i for i in self.issues if i.issue_type == 'suggestion']),
                "auto_fixable": len([i for i in self.issues if i.auto_fixable]),
            },
            "issues": [asdict(issue) for issue in self.issues],
            "files_with_issues": list(set(issue.file_path for issue in self.issues)),
        }
        
        return report
    
    def print_report(self):
        """Print a human-readable report."""
        print("\n" + "="*60)
        print("ANCHOR LINK CHECK REPORT")
        print("="*60)
        
        report = self.generate_report()
        summary = report["summary"]
        
        print(f"Files checked: {summary['total_files_checked']}")
        print(f"Total issues: {summary['total_issues']}")
        print(f"Broken links: {summary['broken_links']}")
        print(f"Suggestions: {summary['suggestions']}")
        print(f"Auto-fixable: {summary['auto_fixable']}")
        
        if self.issues:
            print("\nISSUES BY FILE:")
            print("-" * 40)
            
            issues_by_file = {}
            for issue in self.issues:
                if issue.file_path not in issues_by_file:
                    issues_by_file[issue.file_path] = []
                issues_by_file[issue.file_path].append(issue)
            
            for file_path, file_issues in issues_by_file.items():
                print(f"\n📁 {file_path}")
                for issue in file_issues:
                    icon = "🔗" if issue.issue_type == 'broken_link' else "💡"
                    print(f"  {icon} Line {issue.line_number}: {issue.description}")
                    if issue.suggested_fix:
                        print(f"     Suggested fix: {issue.suggested_fix}")
        else:
            print("\n✅ No anchor link issues found!")

def main():
    parser = argparse.ArgumentParser(description="Check anchor links in README files")
    parser.add_argument("--auto-fix", action="store_true", help="Automatically fix issues where possible")
    parser.add_argument("--output", help="Output report to JSON file")
    parser.add_argument("--root", default=".", help="Root directory to search (default: current directory)")
    
    args = parser.parse_args()
    
    checker = AnchorLinkChecker(args.root)
    issues = checker.check_all_files(auto_fix=args.auto_fix)
    
    # Print report
    checker.print_report()
    
    # Save JSON report if requested
    if args.output:
        report = checker.generate_report()
        with open(args.output, 'w') as f:
            json.dump(report, f, indent=2)
        print(f"\n📄 Report saved to {args.output}")
    
    # Exit with error code if there are critical issues
    broken_links = [i for i in issues if i.issue_type == 'broken_link']
    if broken_links:
        print(f"\n❌ Found {len(broken_links)} broken anchor links!")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())

