// src/components/GanttChart.js
import React, { useState } from 'react';
import Tooltip from './ui/Tooltip';
import AccessibleIcon from './ui/AccessibleIcon';
import ExpandableCard from './ui/ExpandableCard';
import Plot from 'react-plotly.js';

const GanttChart = ({ data }) => {
  // State for zoom and selected task
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleZoom = (factor) => setZoomLevel((zl) => Math.max(0.5, Math.min(3, zl * factor)));
  const handleClick = (event) => {
    const point = event.points && event.points[0];
    if (point) setSelectedTask(data.find(d => d.name === point.y));
  };

  // Build traces with status-based color
  const trace = data.map(proj => ({
    x: [proj.start, proj.end],
    y: [proj.name, proj.name],
    mode: 'lines',
    line: { width: 20, color: proj.statusColor || '#2196f3' },
    name: proj.name,
    customdata: [proj, proj]
  }));

  return (
    <div role="region" aria-labelledby="gantt-title">
      <h3 id="gantt-title">Project Timelines</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Tooltip content="Zoom Out">
          <button onClick={() => handleZoom(0.8)} aria-label="Zoom out" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <AccessibleIcon label="Zoom out">
              <svg width="16" height="16" viewBox="0 0 16 16"><line x1="2" y1="8" x2="14" y2="8" stroke="#000" strokeWidth="2"/></svg>
            </AccessibleIcon>
          </button>
        </Tooltip>
        <Tooltip content="Zoom In">
          <button onClick={() => handleZoom(1.25)} aria-label="Zoom in" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <AccessibleIcon label="Zoom in">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <line x1="8" y1="2" x2="8" y2="14" stroke="#000" strokeWidth="2"/>
                <line x1="2" y1="8" x2="14" y2="8" stroke="#000" strokeWidth="2"/>
              </svg>
            </AccessibleIcon>
          </button>
        </Tooltip>
      </div>
      <Plot
        data={trace}
        layout={{
          height: 400,
          xaxis: { type: 'date', title: 'Date', range: [null, null], autorange: true, range: null },
          yaxis: { title: 'Project', automargin: true },
          margin: { l: 100, r: 20, t: 20, b: 40 },
          zoom: zoomLevel
        }}
        onClick={handleClick}
        useResizeHandler
        style={{ width: '100%' }}
      />
      {selectedTask && (
        <ExpandableCard
          summary={<span>Details: {selectedTask.name}</span>}
          id={`task-detail-${selectedTask.name}`}
        >
          <p><strong>Owner:</strong> {selectedTask.owner}</p>
          <p><strong>Start:</strong> {selectedTask.start}</p>
          <p><strong>End:</strong> {selectedTask.end}</p>
          <p><strong>Status:</strong> {selectedTask.status}</p>
        </ExpandableCard>
      )}
    </div>
  );
}

export default GanttChart;
    mode: 'lines',
    line: { width: 20 },
    name: proj.name
  }));

    <div>
      <h3>Project Timelines</h3>
      <Plot
        data={trace}
        layout={{
          height: 400,
          title: '',
          xaxis: { type: 'date', title: 'Date' },
          yaxis: { title: 'Project', automargin: true }
        }}
        useResizeHandler
        style={{ width: '100%' }}
      />
    </div>
  );

export default GanttChart;

