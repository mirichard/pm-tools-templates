#!/usr/bin/env python3
"""
Metadata Generator for PM Tools Templates

This script automatically adds YAML frontmatter metadata to template files
that don't already have it, supporting the Smart Program Management Environment.
"""

import os
import re
from pathlib import Path
from datetime import datetime

class TemplateMetadataGenerator:
    def __init__(self, repo_path):
        self.repo_path = Path(repo_path)
        self.processed_files = 0
        self.skipped_files = 0
        
        # Enhanced classification patterns
        self.methodology_patterns = {
            'agile': ['sprint', 'scrum', 'backlog', 'user story', 'retrospective', 'standup'],
            'traditional': ['charter', 'wbs', 'gantt', 'milestone', 'phase gate', 'waterfall'],
            'hybrid': ['hybrid', 'mixed', 'adaptive', 'incremental delivery'],
            'universal': ['template', 'general', 'standard', 'common']
        }
        
        self.process_group_patterns = {
            'initiating': ['charter', 'kickoff', 'authorization', 'stakeholder identification'],
            'planning': ['plan', 'schedule', 'budget', 'risk register', 'wbs', 'resource'],
            'executing': ['execution', 'team management', 'communication', 'quality assurance'],
            'monitoring': ['status', 'performance', 'monitoring', 'control', 'reporting'],
            'closing': ['closure', 'lessons learned', 'handover', 'final report']
        }
        
        self.industry_patterns = {
            'healthcare': ['clinical', 'gxp', 'fda', 'pharmaceutical', 'medical', 'validation'],
            'financial': ['compliance', 'audit', 'regulatory', 'sox', 'gdpr'],
            'technology': ['devops', 'api', 'software', 'cybersecurity', 'infrastructure'],
            'manufacturing': ['process control', 'batch', 'quality control', 'lean']
        }
        
        self.role_patterns = {
            'pm': ['project manager', 'program manager'],
            'po': ['product owner', 'product backlog'],
            'sm': ['scrum master', 'agile coach'],
            'team': ['development team', 'team member'],
            'stakeholder': ['stakeholder', 'sponsor', 'customer']
        }

    def has_metadata(self, file_path):
        """Check if file already has YAML frontmatter or structured metadata"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check for YAML frontmatter
        if content.startswith('---\n'):
            return True
            
        # Check for structured metadata table
        if '## 📄 Template Details' in content:
            return True
            
        return False

    def classify_template(self, file_path, content):
        """Intelligently classify template based on filename, path, and content"""
        file_str = str(file_path).lower()
        content_lower = content.lower()
        
        # Default metadata
        metadata = {
            'title': self._extract_title(content),
            'methodology': 'universal',
            'complexity': 'intermediate',
            'process_group': 'universal',
            'industry': 'universal',
            'role': 'universal',
            'tags': [],
            'prerequisites': [],
            'related_templates': [],
            'version': '1.0.0',
            'owner': 'mirichard',
            'updated': datetime.now().strftime('%Y-%m-%d'),
            'estimated_completion_time': '30-45 minutes'
        }
        
        # Classify methodology
        for methodology, patterns in self.methodology_patterns.items():
            if any(pattern in file_str or pattern in content_lower for pattern in patterns):
                metadata['methodology'] = methodology
                break
        
        # Classify process group
        for process_group, patterns in self.process_group_patterns.items():
            if any(pattern in file_str or pattern in content_lower for pattern in patterns):
                metadata['process_group'] = process_group
                break
                
        # Classify industry
        for industry, patterns in self.industry_patterns.items():
            if any(pattern in file_str or pattern in content_lower for pattern in patterns):
                metadata['industry'] = industry
                break
                
        # Classify role
        for role, patterns in self.role_patterns.items():
            if any(pattern in file_str or pattern in content_lower for pattern in patterns):
                metadata['role'] = role
                break
        
        # Generate tags based on classification
        metadata['tags'] = self._generate_tags(file_path, content, metadata)
        
        # Assess complexity based on content length and structure
        metadata['complexity'] = self._assess_complexity(content)
        
        # Estimate completion time based on complexity and length
        metadata['estimated_completion_time'] = self._estimate_completion_time(content, metadata['complexity'])
        
        return metadata

    def _extract_title(self, content):
        """Extract title from content, fallback to filename"""
        # Look for first # heading
        match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if match:
            return match.group(1).strip()
        
        # Look for title in content
        match = re.search(r'title[:\s]+(.+)', content, re.IGNORECASE)
        if match:
            return match.group(1).strip()
            
        return "Template"

    def _generate_tags(self, file_path, content, metadata):
        """Generate relevant tags based on content analysis"""
        tags = set()
        
        # Add methodology as tag
        if metadata['methodology'] != 'universal':
            tags.add(metadata['methodology'])
            
        # Add process group as tag
        if metadata['process_group'] != 'universal':
            tags.add(metadata['process_group'])
            
        # Add common PM tags based on content
        tag_patterns = {
            'risk-management': ['risk', 'mitigation', 'risk register'],
            'stakeholder-management': ['stakeholder', 'sponsor', 'communication'],
            'planning': ['plan', 'planning', 'schedule', 'timeline'],
            'reporting': ['report', 'status', 'dashboard', 'metrics'],
            'quality': ['quality', 'testing', 'validation', 'acceptance'],
            'communication': ['communication', 'meeting', 'update', 'notification']
        }
        
        content_lower = content.lower()
        for tag, patterns in tag_patterns.items():
            if any(pattern in content_lower for pattern in patterns):
                tags.add(tag)
        
        return sorted(list(tags))

    def _assess_complexity(self, content):
        """Assess template complexity based on content characteristics"""
        lines = content.count('\n')
        sections = content.count('##')
        tables = content.count('|')
        
        # Simple scoring algorithm
        score = 0
        score += min(lines / 100, 3)  # Length factor
        score += min(sections / 5, 2)  # Structure complexity
        score += min(tables / 20, 1)  # Table complexity
        
        if score >= 4:
            return 'advanced'
        elif score >= 2:
            return 'intermediate'
        else:
            return 'basic'

    def _estimate_completion_time(self, content, complexity):
        """Estimate time to complete template based on complexity"""
        base_times = {
            'basic': '15-30 minutes',
            'intermediate': '30-45 minutes',
            'advanced': '45-90 minutes'
        }
        
        # Adjust based on content length
        lines = content.count('\n')
        if lines > 500:
            return {'basic': '30-45 minutes', 'intermediate': '60-90 minutes', 'advanced': '90-120 minutes'}[complexity]
        elif lines < 100:
            return {'basic': '10-20 minutes', 'intermediate': '20-30 minutes', 'advanced': '30-60 minutes'}[complexity]
        
        return base_times[complexity]

    def add_metadata_to_file(self, file_path):
        """Add YAML frontmatter metadata to a template file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Skip if already has metadata
            if self.has_metadata(file_path):
                print(f"⏭️  Skipped (has metadata): {file_path}")
                self.skipped_files += 1
                return False
            
            # Generate metadata
            metadata = self.classify_template(file_path, content)
            
            # Create YAML frontmatter
            yaml_content = "---\n"
            for key, value in metadata.items():
                if isinstance(value, list):
                    if value:  # Only add non-empty lists
                        yaml_content += f"{key}:\n"
                        for item in value:
                            yaml_content += f"  - \"{item}\"\n"
                else:
                    yaml_content += f"{key}: \"{value}\"\n"
            yaml_content += "---\n\n"
            
            # Combine with original content
            new_content = yaml_content + content
            
            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ Added metadata: {file_path}")
            self.processed_files += 1
            return True
            
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
            return False

    def process_repository(self, dry_run=True):
        """Process all template files in the repository"""
        print(f"🚀 Starting metadata generation for PM Tools Templates")
        print(f"📁 Repository path: {self.repo_path}")
        print(f"🔍 Mode: {'DRY RUN' if dry_run else 'LIVE PROCESSING'}")
        print("-" * 60)
        
        # Find all template files
        template_files = []
        patterns = ['*template*.md', '*Template*.md']
        
        for pattern in patterns:
            template_files.extend(self.repo_path.rglob(pattern))
        
        # Remove duplicates and sort
        template_files = sorted(set(template_files))
        
        print(f"📋 Found {len(template_files)} template files")
        print("-" * 60)
        
        if dry_run:
            print("🔍 DRY RUN - Analyzing files (no changes will be made):")
            for file_path in template_files:
                if not self.has_metadata(file_path):
                    print(f"🔄 Would process: {file_path}")
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    metadata = self.classify_template(file_path, content)
                    print(f"   📊 Classification: {metadata['methodology']}, {metadata['complexity']}, {metadata['process_group']}")
                else:
                    print(f"⏭️  Would skip: {file_path}")
        else:
            print("🔄 PROCESSING files:")
            for file_path in template_files:
                self.add_metadata_to_file(file_path)
        
        print("-" * 60)
        print(f"📊 Summary:")
        print(f"   • Total files found: {len(template_files)}")
        print(f"   • Files processed: {self.processed_files}")
        print(f"   • Files skipped: {self.skipped_files}")
        print(f"   • Success rate: {(self.processed_files / len(template_files) * 100):.1f}%")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Add metadata to PM template files')
    parser.add_argument('--repo-path', default='/Users/michael/pm-tools-templates', 
                       help='Path to the pm-tools-templates repository')
    parser.add_argument('--dry-run', action='store_true', default=True,
                       help='Perform dry run (no changes made)')
    parser.add_argument('--execute', action='store_true',
                       help='Actually execute the changes (overrides dry-run)')
    
    args = parser.parse_args()
    
    generator = TemplateMetadataGenerator(args.repo_path)
    
    # Execute based on arguments
    dry_run = args.dry_run and not args.execute
    generator.process_repository(dry_run=dry_run)

if __name__ == "__main__":
    main()
