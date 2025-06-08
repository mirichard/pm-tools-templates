#!/usr/bin/env python3
"""
MPP to Jira Export Script

This script exports Microsoft Project data to a format compatible with Jira import.
It processes custom fields and maintains hierarchy relationships.

Requirements:
- python-docx
- xlsxwriter
- argparse

Usage:
    python mpp_to_jira_export.py --input project.xml --output jira_import.csv
"""

import argparse
import csv
import json
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MPPToJiraExporter:
    def __init__(self):
        self.tasks = []
        self.epics = []
        self.stories = []
        self.field_mapping = {
            'Name': 'Summary',
            'Notes': 'Description',
            'Start': 'Start Date',
            'Finish': 'Due Date',
            'PercentComplete': 'Progress',
            'Text1': 'Jira_Epic_Key',
            'Text2': 'Jira_Story_Key',
            'Text3': 'Jira_Issue_Type',
            'Text4': 'Jira_Priority',
            'Text5': 'Jira_Labels',
            'Text6': 'Jira_Sprint',
            'Number1': 'Jira_Story_Points',
            'Text7': 'Jira_Assignee',
            'Text8': 'Jira_Component',
            'Flag1': 'Export_Flag'
        }
    
    def parse_mpp_xml(self, xml_file):
        """
        Parse Microsoft Project XML export file
        """
        try:
            tree = ET.parse(xml_file)
            root = tree.getroot()
            
            # Find namespace
            namespace = {'ms': 'http://schemas.microsoft.com/project'}
            
            tasks = root.findall('.//ms:Task', namespace)
            logger.info(f"Found {len(tasks)} tasks in MPP file")
            
            for task in tasks:
                task_data = self.extract_task_data(task, namespace)
                if task_data and task_data.get('Export_Flag', 'No') == 'Yes':
                    self.tasks.append(task_data)
                    
            logger.info(f"Exported {len(self.tasks)} tasks marked for export")
            return True
            
        except Exception as e:
            logger.error(f"Error parsing MPP XML: {str(e)}")
            return False
    
    def extract_task_data(self, task, namespace):
        """
        Extract task data from XML element
        """
        task_data = {}
        
        # Basic fields
        task_data['ID'] = self.get_element_text(task, 'ms:ID', namespace)
        task_data['Name'] = self.get_element_text(task, 'ms:Name', namespace)
        task_data['Notes'] = self.get_element_text(task, 'ms:Notes', namespace)
        task_data['Start'] = self.get_element_text(task, 'ms:Start', namespace)
        task_data['Finish'] = self.get_element_text(task, 'ms:Finish', namespace)
        task_data['Duration'] = self.get_element_text(task, 'ms:Duration', namespace)
        task_data['PercentComplete'] = self.get_element_text(task, 'ms:PercentComplete', namespace)
        task_data['OutlineLevel'] = self.get_element_text(task, 'ms:OutlineLevel', namespace)
        
        # Custom fields (Text1-Text10, Number1-Number5, Flag1-Flag20)
        for i in range(1, 11):
            task_data[f'Text{i}'] = self.get_element_text(task, f'ms:Text{i}', namespace)
        
        for i in range(1, 6):
            task_data[f'Number{i}'] = self.get_element_text(task, f'ms:Number{i}', namespace)
            
        for i in range(1, 21):
            flag_value = self.get_element_text(task, f'ms:Flag{i}', namespace)
            task_data[f'Flag{i}'] = 'Yes' if flag_value == '1' else 'No'
        
        return task_data
    
    def get_element_text(self, parent, tag, namespace):
        """
        Safely get text from XML element
        """
        element = parent.find(tag, namespace)
        return element.text if element is not None and element.text else ''
    
    def categorize_tasks(self):
        """
        Categorize tasks into Epics, Stories, and Tasks based on issue type
        """
        for task in self.tasks:
            issue_type = task.get('Text3', '').lower()  # Jira_Issue_Type
            
            if issue_type == 'epic':
                self.epics.append(task)
            elif issue_type == 'story':
                self.stories.append(task)
            # Tasks are handled as regular items
    
    def format_for_jira(self, task):
        """
        Format task data for Jira import
        """
        jira_task = {
            'Summary': task.get('Name', ''),
            'Description': task.get('Notes', ''),
            'Issue Type': task.get('Text3', 'Task'),  # Jira_Issue_Type
            'Priority': task.get('Text4', 'Medium'),  # Jira_Priority
            'Labels': task.get('Text5', ''),  # Jira_Labels
            'Sprint': task.get('Text6', ''),  # Jira_Sprint
            'Story Points': task.get('Number1', ''),  # Jira_Story_Points
            'Assignee': task.get('Text7', ''),  # Jira_Assignee
            'Component': task.get('Text8', ''),  # Jira_Component
            'Start Date': self.format_date(task.get('Start', '')),
            'Due Date': self.format_date(task.get('Finish', '')),
            'Original Estimate': self.format_duration(task.get('Duration', '')),
            'Epic Link': task.get('Text1', ''),  # Jira_Epic_Key
            'Parent': self.determine_parent(task),
            'External ID': f"MPP-{task.get('ID', '')}"
        }
        
        return jira_task
    
    def format_date(self, date_str):
        """
        Format date for Jira import
        """
        if not date_str:
            return ''
        
        try:
            # Parse MPP date format and convert to Jira format
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            return dt.strftime('%Y-%m-%d')
        except:
            return date_str
    
    def format_duration(self, duration_str):
        """
        Convert MPP duration to Jira time format
        """
        if not duration_str:
            return ''
        
        # Simple conversion - customize based on your needs
        try:
            # Assume duration is in hours
            hours = float(duration_str.replace('PT', '').replace('H', ''))
            return f"{int(hours)}h"
        except:
            return duration_str
    
    def determine_parent(self, task):
        """
        Determine parent relationship based on hierarchy
        """
        outline_level = int(task.get('OutlineLevel', '0'))
        
        if outline_level <= 1:
            return ''  # Top level items
        
        # Find parent based on outline level
        task_id = int(task.get('ID', '0'))
        for other_task in self.tasks:
            other_id = int(other_task.get('ID', '0'))
            other_level = int(other_task.get('OutlineLevel', '0'))
            
            if (other_id < task_id and 
                other_level == outline_level - 1):
                return other_task.get('Text2', '')  # Return Jira_Story_Key
        
        return ''
    
    def export_to_csv(self, output_file):
        """
        Export formatted data to CSV for Jira import
        """
        if not self.tasks:
            logger.error("No tasks to export")
            return False
        
        try:
            with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
                # Define CSV headers
                fieldnames = [
                    'Summary', 'Description', 'Issue Type', 'Priority', 'Labels',
                    'Sprint', 'Story Points', 'Assignee', 'Component',
                    'Start Date', 'Due Date', 'Original Estimate',
                    'Epic Link', 'Parent', 'External ID'
                ]
                
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                
                for task in self.tasks:
                    jira_task = self.format_for_jira(task)
                    writer.writerow(jira_task)
                
                logger.info(f"Successfully exported {len(self.tasks)} tasks to {output_file}")
                return True
                
        except Exception as e:
            logger.error(f"Error writing CSV file: {str(e)}")
            return False
    
    def export_to_json(self, output_file):
        """
        Export formatted data to JSON for API import
        """
        if not self.tasks:
            logger.error("No tasks to export")
            return False
        
        try:
            export_data = {
                'metadata': {
                    'export_date': datetime.now().isoformat(),
                    'total_tasks': len(self.tasks),
                    'epics_count': len(self.epics),
                    'stories_count': len(self.stories)
                },
                'tasks': []
            }
            
            for task in self.tasks:
                export_data['tasks'].append(self.format_for_jira(task))
            
            with open(output_file, 'w', encoding='utf-8') as jsonfile:
                json.dump(export_data, jsonfile, indent=2, ensure_ascii=False)
            
            logger.info(f"Successfully exported {len(self.tasks)} tasks to {output_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error writing JSON file: {str(e)}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Export MPP data to Jira format')
    parser.add_argument('--input', '-i', required=True, help='Input MPP XML file')
    parser.add_argument('--output', '-o', required=True, help='Output file (CSV or JSON)')
    parser.add_argument('--format', '-f', choices=['csv', 'json'], default='csv', help='Output format')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Check input file exists
    if not Path(args.input).exists():
        logger.error(f"Input file not found: {args.input}")
        return 1
    
    # Initialize exporter
    exporter = MPPToJiraExporter()
    
    # Parse MPP file
    if not exporter.parse_mpp_xml(args.input):
        logger.error("Failed to parse MPP file")
        return 1
    
    # Categorize tasks
    exporter.categorize_tasks()
    
    # Export data
    if args.format == 'json':
        success = exporter.export_to_json(args.output)
    else:
        success = exporter.export_to_csv(args.output)
    
    if success:
        logger.info("Export completed successfully")
        return 0
    else:
        logger.error("Export failed")
        return 1

if __name__ == '__main__':
    exit(main())

