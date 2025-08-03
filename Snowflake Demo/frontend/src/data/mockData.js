// src/data/mockData.js

export const projectsData = [
  { project_id: 1, name: 'Demo Project', start: '2025-07-01', end: '2025-12-31' },
  { project_id: 2, name: 'Second Project', start: '2025-06-15', end: '2025-11-30' }
];

export const milestonesData = [
  { milestone_id: 1, project_id: 1, name: 'Design', due: '2025-08-01', status: 'Pending' },
  { milestone_id: 2, project_id: 1, name: 'Develop', due: '2025-09-01', status: 'Pending' }
];

export const tasksData = [
  { task_id: 101, milestone_id: 1, name: 'Define scope', status: 'Completed' },
  { task_id: 102, milestone_id: 1, name: 'Set up env', status: 'In Progress' }
];

export const risksData = [
  { risk_id: 1, project_id: 1, likelihood: 'High', impact: 'Medium' }
];

export const resourceLoadData = [
  { resource: 'Alice', date: '2025-07-20', load: 0.75 },
  { resource: 'Bob', date: '2025-07-20', load: 0.50 }
];

