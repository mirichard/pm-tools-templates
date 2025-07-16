// src/components/PortfolioSummary.js
import React from 'react';
import ExpandableCard from './ui/ExpandableCard';
import AccessibleIcon from './ui/AccessibleIcon';

/**
 * PortfolioSummary component: displays a list of projects with lifecycle badges,
 * status icons for schedule and budget, and expandable details.
 * Props:
 *   data: array of project objects with fields:
 *     - project_id, name, lifecycle, scheduleHealth, budgetHealth,
 *       budgetPlan, budgetActual, scheduleSnapshot
 */
const PortfolioSummary = ({ data }) => (
  <div role="region" aria-labelledby="portfolio-summary-title">
    <h3 id="portfolio-summary-title">Portfolio Summary</h3>
    {data.map((proj) => {
      // Determine badge color for lifecycle
      const lifecycleColor =
        proj.lifecycle === 'Planning' ? '#90caf9' :
        proj.lifecycle === 'Active' ? '#a5d6a7' :
        proj.lifecycle === 'Closed' ? '#eeeeee' :
        '#ccc';

      // Icons for health statuses
      const renderHealthIcon = (label, healthy) => (
        <AccessibleIcon
          label={`${label} ${healthy ? 'Good' : 'Attention'}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill={healthy ? '#4caf50' : '#f44336'} xmlns="http://www.w3.org/2000/svg">
            {healthy ? (
              <path d="M6 10l-2-2 1-1 1 1 3-3 1 1-4 4z" />
            ) : (
              <circle cx="8" cy="8" r="7" />
            )}
          </svg>
        </AccessibleIcon>
      );

      return (
        <ExpandableCard
          key={proj.project_id}
          id={`portfolio-${proj.project_id}`}
          summary={
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{proj.name}</span>
              <span
                style={{
                  padding: '2px 6px',
                  backgroundColor: lifecycleColor,
                  borderRadius: '4px',
                }}
              >
                {proj.lifecycle}
              </span>
              {renderHealthIcon('Schedule', proj.scheduleHealth === 'Good')}
              {renderHealthIcon('Budget', proj.budgetHealth === 'Good')}
            </div>
          }
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginTop: '8px',
            }}
          >
            <div>
              <strong>Budget Plan:</strong> {proj.budgetPlan}
            </div>
            <div>
              <strong>Budget Actual:</strong> {proj.budgetActual}
            </div>
            <div>
              <strong>Schedule Snapshot:</strong> {proj.scheduleSnapshot}
            </div>
          </div>
        </ExpandableCard>
      );
    })}
  </div>
);

export default PortfolioSummary;

