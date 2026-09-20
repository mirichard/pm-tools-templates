/* Shared assessment data and scoring; no network calls or persistence. */
(function (root) {
  'use strict';
  const principles = [
  {
    "id": "stewardship",
    "name": "Stewardship",
    "questions": [
      "Are accountable owners named for resources and decisions?",
      "Are sensitive records and original decisions protected?",
      "Are ethical concerns and long-term impacts raised with an owner?"
    ],
    "templates": [
      {
        "title": "Project Charter Template",
        "path": "../../domains/planning/templates/traditional/Traditional/Process_Groups/Initiating/project_charter_template.md"
      },
      {
        "title": "Raid Log Template",
        "path": "../../domains/delivery/templates/traditional/Traditional/Templates/raid_log_template.md"
      }
    ]
  },
  {
    "id": "value-focus",
    "name": "Value focus",
    "questions": [
      "Are intended outcomes distinct from delivered outputs?",
      "Does each material benefit have a measure and owner?",
      "Do reviews change investment decisions when expected value changes?"
    ],
    "templates": [
      {
        "title": "Benefits Review Template",
        "path": "../../templates/universal/benefits-review-template.md"
      },
      {
        "title": "Roi Tracking Template",
        "path": "../../domains/delivery/templates/traditional/Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md"
      }
    ]
  },
  {
    "id": "stakeholder-engagement",
    "name": "Stakeholder engagement",
    "questions": [
      "Are affected groups identified, including less-visible users?",
      "Can their input influence the relevant decisions?",
      "Are responses and unresolved concerns communicated back?"
    ],
    "templates": [
      {
        "title": "Stakeholder Register Template",
        "path": "../../domains/stakeholder/project-lifecycle/01-initiation/stakeholder-analysis/stakeholder-register-template.md"
      },
      {
        "title": "Communication Plan Template",
        "path": "../../domains/delivery/templates/traditional/Traditional/Templates/communication_plan_template.md"
      }
    ]
  },
  {
    "id": "systems-thinking",
    "name": "Systems thinking",
    "questions": [
      "Are upstream and downstream dependencies visible?",
      "Are operational handover and support effects considered?",
      "Are tradeoffs across teams and unintended effects assessed?"
    ],
    "templates": [
      {
        "title": "Raid Log Template",
        "path": "../../domains/delivery/templates/traditional/Traditional/Templates/raid_log_template.md"
      },
      {
        "title": "Handover Template",
        "path": "../../domains/measurement/role-based-toolkits/project-manager/essential-templates/handover-template.md"
      }
    ]
  },
  {
    "id": "adaptability",
    "name": "Adaptability",
    "questions": [
      "Does the delivery approach fit the project context?",
      "Are material tailoring decisions and retained safeguards recorded?",
      "Is the approach revisited when uncertainty or constraints change?"
    ],
    "templates": [
      {
        "title": "Hybrid Project Management Plan Template",
        "path": "../../domains/delivery/project-lifecycle/02-planning/project-management-plan/hybrid-project-management-plan-template.md"
      },
      {
        "title": "Hybrid Project Assessment Template",
        "path": "../../domains/delivery/project-assessment-suite/hybrid-project-assessment-template.md"
      }
    ]
  },
  {
    "id": "quality-by-design",
    "name": "Quality by design",
    "questions": [
      "Are acceptance criteria agreed before implementation?",
      "Do verification plans address important user and failure scenarios?",
      "Are defects and unmet criteria tracked to an acceptance decision?"
    ],
    "templates": [
      {
        "title": "Test Plan Template",
        "path": "../../domains/measurement/industry-specializations/information-technology/software-development/test_plan_template.md"
      },
      {
        "title": "Uat Plan Template",
        "path": "../../domains/delivery/templates/traditional/Traditional/Templates/uat_plan_template.md"
      }
    ]
  },
  {
    "id": "evidence-based-decisions",
    "name": "Evidence-based decisions",
    "questions": [
      "Can important claims be traced to dated sources?",
      "Are assumptions and uncertainty separated from observed facts?",
      "Are calculations and status rules checked before decisions?"
    ],
    "templates": [
      {
        "title": "Benefits Variance Analysis Template",
        "path": "../../templates/universal/benefits-variance-analysis-template.md"
      },
      {
        "title": "Status Report Template",
        "path": "../../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md"
      }
    ]
  },
  {
    "id": "risk-optimization",
    "name": "Risk optimization",
    "questions": [
      "Are material threats and opportunities identified early?",
      "Do they have response owners and escalation triggers?",
      "Are controls proportionate to exposure and reviewed for effectiveness?"
    ],
    "templates": [
      {
        "title": "Risk Management Plan Template",
        "path": "../../domains/measurement/project-lifecycle/02-planning/risk-management/risk-management-plan-template.md"
      },
      {
        "title": "Risk Register Template",
        "path": "../../domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md"
      }
    ]
  },
  {
    "id": "collaborative-leadership",
    "name": "Collaborative leadership",
    "questions": [
      "Are decision rights and escalation paths understood?",
      "Can people challenge assumptions and raise impediments safely?",
      "Are author checks distinguished from required approval?"
    ],
    "templates": [
      {
        "title": "Team Charter Template",
        "path": "../../domains/team/project-lifecycle/02-planning/resource-planning/team-charter-template.md"
      },
      {
        "title": "Agile Team Charter Template",
        "path": "../../domains/team/project-lifecycle/01-initiation/project-charter/agile-team-charter-template.md"
      }
    ]
  },
  {
    "id": "continuous-learning",
    "name": "Continuous learning",
    "questions": [
      "Do reviews identify causes rather than only symptoms?",
      "Do improvement actions have owners and follow-up dates?",
      "Are useful findings applied to later plans or working practices?"
    ],
    "templates": [
      {
        "title": "Sprint Retrospective Template",
        "path": "../../domains/team/templates/agile/sprint_retrospective_template.md"
      },
      {
        "title": "Remediation Action Plan Template",
        "path": "../../domains/measurement/project-assessment-suite/remediation-action-plan-template.md"
      }
    ]
  }
];
  function score(answers) {
    if (!Array.isArray(answers) || answers.length !== principles.length * 3) {
      throw new TypeError('Expected 30 answers');
    }
    if (answers.some(value => value !== null && (!Number.isInteger(value) || value < 1 || value > 5))) {
      throw new RangeError('Answers must be null or integers from 1 to 5');
    }
    const completed = answers.filter(value => value !== null).length;
    const results = principles.map((principle, index) => {
      const values = answers.slice(index * 3, index * 3 + 3);
      return {id: principle.id, mean: values.includes(null) ? null : values.reduce((a, b) => a + b, 0) / 3};
    });
    return {completed, results, overall: completed === answers.length ? answers.reduce((a, b) => a + b, 0) / answers.length : null};
  }
  const api = {principles, score};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PrincipleAssessment = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
