import { toCharterMarkdown } from './to/charter';
import { toRiskMarkdown } from './to/risk';
import { toStakeholderMarkdown } from './to/stakeholder';
import { toSprintMarkdown } from './to/sprint';
import { toExecutiveMarkdown } from './to/executive';

export const schemas = {
  charter: {
    title: 'Project Charter', type: 'object',
    properties: {
      projectName: { type: 'string', title: 'Project Name' },
      sponsor: { type: 'string', title: 'Sponsor' },
      purpose: { type: 'string', title: 'Purpose' },
      scope: { type: 'string', title: 'Scope' },
      successCriteria: { type: 'string', title: 'Success Criteria' }
    },
    required: ['projectName', 'purpose', 'scope']
  },
  risk: {
    title: 'Risk Register', type: 'object',
    properties: {
      risks: { type: 'array', items: {
        type: 'object', properties: {
          id: { type: 'string', title: 'ID' },
          description: { type: 'string', title: 'Description' },
          probability: { type: 'number', title: 'Probability' },
          impact: { type: 'string', enum: ['Low','Medium','High'] },
          mitigation: { type: 'string', title: 'Mitigation' },
          owner: { type: 'string', title: 'Owner' }
        }, required: ['description','probability','impact']
      } }
    }, required: ['risks']
  },
  stakeholder: {
    title: 'Stakeholder Communication Plan', type: 'object',
    properties: {
      stakeholders: { type: 'array', items: {
        type: 'object', properties: {
          name: { type: 'string', title: 'name' },
          role: { type: 'string', title: 'role' },
          contact: { type: 'string', title: 'contact' },
          infoNeeds: { type: 'string', title: 'Information Needs' },
          frequency: { type: 'string', enum: ['Daily','Weekly','Biweekly','Monthly','Quarterly'] },
          channel: { type: 'string', enum: ['Email','Meeting','Report','Dashboard'] }
        }, required: ['name','role','frequency','channel']
      } }
    }, required: ['stakeholders']
  },
  sprint: {
    title: 'Sprint Planning', type: 'object',
    properties: {
      sprintName: { type: 'string', title: 'sprintName' },
      startDate: { type: 'string', title: 'startDate' },
      endDate: { type: 'string', title: 'endDate' },
      goals: { type: 'array', items: { type: 'string' } },
      stories: { type: 'array', items: { type: 'object', properties: {
        id: { type: 'string', title: 'id' },
        title: { type: 'string', title: 'title' },
        estimate: { type: 'number', title: 'estimate' }
      }, required: ['title'] } }
    }, required: ['sprintName','startDate','endDate']
  },
  executive: {
    title: 'Executive Status Report', type: 'object',
    properties: {
      reportingPeriod: { type: 'string', title: 'Reporting Period' },
      overallHealth: { type: 'string', enum: ['Green','Yellow','Red'], title: 'Overall Health' },
      schedule: { type: 'string', enum: ['On Track','At Risk','Off Track'], title: 'Schedule' },
      budget: { type: 'string', enum: ['On Track','At Risk','Off Track'], title: 'Budget' },
      scope: { type: 'string', enum: ['On Track','At Risk','Off Track'], title: 'Scope' },
      highlights: { type: 'string', title: 'Highlights' },
      risks: { type: 'string', title: 'Risks' },
      nextSteps: { type: 'string', title: 'Next Steps' }
    }, required: ['reportingPeriod','overallHealth']
  }
} as const;

export function toMarkdown(t: keyof typeof schemas, data: any): string {
  switch (t) {
    case 'charter': return toCharterMarkdown(data);
    case 'risk': return toRiskMarkdown(data);
    case 'stakeholder': return toStakeholderMarkdown(data);
    case 'sprint': return toSprintMarkdown(data);
    case 'executive': return toExecutiveMarkdown(data);
  }
}
