// src/components/GanttChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const GanttChart = ({ data }) => {
  const trace = data.map(proj => ({
    x: [proj.start, proj.end],
    y: [proj.name, proj.name],
    mode: 'lines',
    line: { width: 20 },
    name: proj.name
  }));

  return (
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
};

export default GanttChart;

