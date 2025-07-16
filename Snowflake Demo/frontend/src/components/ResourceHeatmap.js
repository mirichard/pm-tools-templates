// src/components/ResourceHeatmap.js
import React from 'react';
import Plot from 'react-plotly.js';

const ResourceHeatmap = ({ data }) => {
  const resources = Array.from(new Set(data.map(d => d.resource)));
  const dates = Array.from(new Set(data.map(d => d.date))).sort();
  const z = resources.map(r =>
    dates.map(date => {
      const entry = data.find(x => x.resource === r && x.date === date);
      return entry ? entry.load : 0;
    })
  );

  return (
    <div>
      <h3>Resource Load Heatmap</h3>
      <Plot
        data={[{
          x: dates,
          y: resources,
          z,
          type: 'heatmap',
          colorscale: 'Viridis'
        }]}
        layout={{ height: 400, yaxis: { automargin: true } }}
        useResizeHandler
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default ResourceHeatmap;

