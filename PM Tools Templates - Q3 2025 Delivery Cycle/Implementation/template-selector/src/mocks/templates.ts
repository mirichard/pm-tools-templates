import { Template } from '../types';

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Project Charter',
    description: 'Standard template for initiating a project and defining high-level project details',
    methodology: 'PMBOK',
    category: 'Initiation'
  },
  {
    id: '2',
    name: 'Sprint Planning',
    description: 'Template for planning and organizing sprint activities',
    methodology: 'Agile',
    category: 'Planning'
  },
  {
    id: '3',
    name: 'Risk Register',
    description: 'Template for tracking and managing project risks',
    methodology: 'Hybrid',
    category: 'Risk Management'
  },
  {
    id: '4',
    name: 'Stakeholder Register',
    description: 'Template for documenting and analyzing stakeholder information',
    methodology: 'PMBOK',
    category: 'Stakeholder Management'
  },
  {
    id: '5',
    name: 'Daily Standup',
    description: 'Template for conducting daily standup meetings',
    methodology: 'Agile',
    category: 'Execution'
  }
];
